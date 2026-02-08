Specification: Phase IV - Local Kubernetes Deployment
Document Information
Spec ID: SPEC-PHASE4-001
Version: 1.0.0
Status: Active
Created: Phase IV Kickoff
Owner: Hackathon Participant
Related Constitution: constitution-phase4.md

1. Executive Summary
1.1 Purpose
Transform the Phase III AI-powered Todo Chatbot into a cloud-native application running on local Kubernetes infrastructure using Minikube, demonstrating production-ready containerization, orchestration, and AI-assisted DevOps practices.
1.2 Scope
In Scope:

Containerization of Next.js frontend and FastAPI backend
Kubernetes deployment manifests (Deployments, Services, ConfigMaps, Secrets)
Helm chart creation for streamlined deployment
Local Kubernetes cluster setup with Minikube
AI-assisted infrastructure operations using Gordon, kubectl-ai, and Kagent
Integration with external Neon PostgreSQL database
Preservation of all Phase III functionality (chatbot, MCP, Better Auth)

Out of Scope:

Cloud deployment (Phase V)
Event-driven architecture with Kafka (Phase V)
Dapr integration (Phase V)
Advanced/Intermediate features (Phase V)
CI/CD pipeline automation (Phase V)

1.3 Success Definition
Phase IV is successful when a developer can:

Clone the repository
Run minikube start and helm install todo-chatbot ./helm-charts/todo-chatbot
Access the fully functional Todo Chatbot at http://<minikube-ip>:30080
Perform all Basic Level operations via natural language
Verify pod health with kubectl get pods (all Running)


2. User Stories
2.1 As a DevOps Engineer
Story 1: Containerize the Application
As a DevOps engineer
I want to containerize the frontend and backend applications
So that they can run consistently across different environments
Acceptance Criteria:

 Multi-stage Dockerfile for Next.js frontend reduces image size by 60%+
 Python backend Dockerfile is under 300MB
 Both containers start successfully with docker run
 Health check endpoints return 200 OK
 No secrets hardcoded in Dockerfiles

Story 2: Deploy to Kubernetes
As a DevOps engineer
I want to deploy the containerized application to Minikube
So that I can simulate a production Kubernetes environment locally
Acceptance Criteria:

 All pods reach Running state within 2 minutes
 Frontend and backend can communicate via Kubernetes Services
 Application accessible via NodePort or Ingress
 Database connection to Neon works from pods
 Rolling updates work without downtime

Story 3: Package with Helm
As a DevOps engineer
I want to create a Helm chart for the Todo application
So that deployment can be parameterized and version-controlled
Acceptance Criteria:

 helm lint passes with zero errors
 helm install deploys all resources correctly
 Values.yaml allows customization of replicas, resources, image tags
 Chart includes README with configuration options
 helm upgrade works seamlessly

2.2 As a Developer
Story 4: Use AI DevOps Tools
As a developer
I want to use AI-assisted tools (Gordon, kubectl-ai, Kagent)
So that I can manage Docker and Kubernetes operations more efficiently
Acceptance Criteria:

 Gordon successfully generates Dockerfiles from natural language
 kubectl-ai creates valid Kubernetes manifests from descriptions
 Kagent provides actionable cluster health insights
 All AI tool interactions documented in deployment runbook

Story 5: Quick Local Setup
As a developer joining the project
I want clear documentation to run the app locally
So that I can start contributing within 15 minutes
Acceptance Criteria:

 README includes prerequisites checklist
 Step-by-step setup instructions tested on clean machine
 Troubleshooting section covers 5+ common issues
 Architecture diagram explains component relationships

2.3 As an End User
Story 6: Seamless Application Experience
As an end user
I want the containerized chatbot to work identically to Phase III
So that my workflow is not disrupted by infrastructure changes
Acceptance Criteria:

 All Basic Level features functional (Add, Delete, Update, View, Complete)
 Natural language commands work ("Add buy groceries")
 Better Auth login/signup works in containerized environment
 Tasks persist across pod restarts
 Response times under 2 seconds for typical operations


3. Functional Requirements
3.1 Containerization Requirements
3.1.1 Frontend Container (Next.js)
Requirement ID: FR-CONT-001
Priority: P0 (Critical)
Description:
Create an optimized, production-ready Docker container for the Next.js 16 frontend application.
Specifications:
dockerfile# Multi-stage build pattern required
Stage 1 (Builder):
  - Base: node:20-alpine
  - Install dependencies (npm ci)
  - Build Next.js app (npm run build)
  - Output: .next/ and public/ directories

Stage 2 (Runner):
  - Base: node:20-alpine
  - Copy only production dependencies
  - Copy build artifacts from Stage 1
  - Run as non-root user (node)
  - Expose port 3000
  - Health check: GET /api/health (added endpoint)

Image Size Target: < 500MB
Build Time Target: < 5 minutes on standard hardware
Environment Variables (via ConfigMap/Secret):

NEXT_PUBLIC_API_URL - Backend API endpoint
NEXT_PUBLIC_OPENAI_DOMAIN_KEY - OpenAI ChatKit key
BETTER_AUTH_SECRET - Auth secret
DATABASE_URL - Neon connection string

Validation:
bashdocker build -t todo-frontend:v1 ./frontend
docker run -p 3000:3000 --env-file .env.local todo-frontend:v1
# Should start and respond to http://localhost:3000

3.1.2 Backend Container (FastAPI + MCP)
Requirement ID: FR-CONT-002
Priority: P0 (Critical)
Description:
Create a secure, performant Docker container for the Python FastAPI backend with MCP server.
Specifications:
dockerfile# Multi-stage build pattern required
Stage 1 (Builder):
  - Base: python:3.13-slim
  - Install uv package manager
  - Install dependencies (requirements.txt)
  - No need for source code build (Python is interpreted)

Stage 2 (Runner):
  - Base: python:3.13-slim
  - Copy installed packages from Stage 1
  - Copy application source code
  - Run as non-root user (appuser, UID 1000)
  - Expose port 8000
  - Health check: GET /api/health

Image Size Target: < 300MB
Startup Time Target: < 10 seconds
Environment Variables (via Secret):

DATABASE_URL - Neon PostgreSQL connection string
OPENAI_API_KEY - OpenAI API key for Agents SDK
BETTER_AUTH_SECRET - JWT verification secret
MCP_SERVER_PORT - MCP server port (default 8001)

Validation:
bashdocker build -t todo-backend:v1 ./backend
docker run -p 8000:8000 --env-file .env.local todo-backend:v1
# Should start and respond to http://localhost:8000/docs

3.2 Kubernetes Resources Requirements
3.2.1 Frontend Deployment
Requirement ID: FR-K8S-001
Priority: P0 (Critical)
Specification:
yamlapiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-frontend
  labels:
    app: todo-chatbot
    component: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-chatbot
      component: frontend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: todo-chatbot
        component: frontend
    spec:
      containers:
      - name: frontend
        image: todo-frontend:v1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
        env:
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: todo-config
              key: backend-url
        - name: BETTER_AUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: auth-secret
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
Acceptance Criteria:

 Exactly 2 replicas running at all times
 Rolling updates complete without service interruption
 Health probes prevent traffic to unhealthy pods
 Resource limits prevent pod from consuming excess cluster resources


3.2.2 Backend Deployment
Requirement ID: FR-K8S-002
Priority: P0 (Critical)
Specification:
yamlapiVersion: apps/v1
kind: Deployment
metadata:
  name: todo-backend
  labels:
    app: todo-chatbot
    component: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: todo-chatbot
      component: backend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: todo-chatbot
        component: backend
    spec:
      containers:
      - name: backend
        image: todo-backend:v1
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8000
          name: http
        - containerPort: 8001
          name: mcp
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: database-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: openai-api-key
        - name: BETTER_AUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: todo-secrets
              key: auth-secret
        resources:
          requests:
            cpu: 200m
            memory: 256Mi
          limits:
            cpu: 1000m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
Acceptance Criteria:

 Backend pods successfully connect to Neon database
 MCP server port accessible within cluster
 OpenAI Agents SDK initializes without errors
 Horizontal scaling tested (scale to 3 replicas and back)


3.2.3 Frontend Service
Requirement ID: FR-K8S-003
Priority: P0 (Critical)
Specification:
yamlapiVersion: v1
kind: Service
metadata:
  name: todo-frontend-service
  labels:
    app: todo-chatbot
    component: frontend
spec:
  type: NodePort
  selector:
    app: todo-chatbot
    component: frontend
  ports:
  - name: http
    port: 3000
    targetPort: 3000
    nodePort: 30080
Acceptance Criteria:

 Service accessible at http://<minikube-ip>:30080
 Load balanced across all frontend pods
 Endpoints update automatically when pods scale


3.2.4 Backend Service
Requirement ID: FR-K8S-004
Priority: P0 (Critical)
Specification:
yamlapiVersion: v1
kind: Service
metadata:
  name: todo-backend-service
  labels:
    app: todo-chatbot
    component: backend
spec:
  type: ClusterIP
  selector:
    app: todo-chatbot
    component: backend
  ports:
  - name: http
    port: 8000
    targetPort: 8000
  - name: mcp
    port: 8001
    targetPort: 8001
Acceptance Criteria:

 Backend NOT accessible from outside cluster (ClusterIP)
 Frontend can reach backend via service DNS (todo-backend-service:8000)
 MCP port accessible to pods needing tool invocation


3.2.5 ConfigMap
Requirement ID: FR-K8S-005
Priority: P1 (High)
Specification:
yamlapiVersion: v1
kind: ConfigMap
metadata:
  name: todo-config
data:
  backend-url: "http://todo-backend-service:8000"
  mcp-url: "http://todo-backend-service:8001"
  environment: "local"
  log-level: "info"
Acceptance Criteria:

 Frontend receives correct backend URL
 ConfigMap changes trigger pod restarts (via Helm upgrade)
 No sensitive data in ConfigMap


3.2.6 Secret
Requirement ID: FR-K8S-006
Priority: P0 (Critical)
Specification:
yamlapiVersion: v1
kind: Secret
metadata:
  name: todo-secrets
type: Opaque
data:
  database-url: <base64-encoded-neon-connection-string>
  openai-api-key: <base64-encoded-openai-key>
  auth-secret: <base64-encoded-better-auth-secret>
```

**Security Requirements:**
- [ ] Secret values stored in `.env` file (git-ignored)
- [ ] Secret creation scripted (e.g., `kubectl create secret generic todo-secrets --from-env-file=.env`)
- [ ] No secrets committed to version control
- [ ] Secret rotation documented in runbook

---

### 3.3 Helm Chart Requirements

#### 3.3.1 Chart Structure
**Requirement ID:** FR-HELM-001  
**Priority:** P0 (Critical)

**Specification:**
```
helm-charts/todo-chatbot/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml (optional)
├── values-prod.yaml (optional)
├── templates/
│   ├── _helpers.tpl
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── ingress.yaml (optional)
│   └── NOTES.txt
├── .helmignore
└── README.md
Chart.yaml:
yamlapiVersion: v2
name: todo-chatbot
description: AI-Powered Todo Chatbot - Phase IV
type: application
version: 1.0.0
appVersion: "4.0.0"
keywords:
  - todo
  - chatbot
  - ai
  - mcp
maintainers:
  - name: Hackathon Participant
    email: your-email@example.com

3.3.2 Values Configuration
Requirement ID: FR-HELM-002
Priority: P0 (Critical)
Specification:
yaml# values.yaml
global:
  environment: local

frontend:
  replicaCount: 2
  image:
    repository: todo-frontend
    tag: v1
    pullPolicy: IfNotPresent
  service:
    type: NodePort
    port: 3000
    nodePort: 30080
  resources:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi
  healthCheck:
    enabled: true
    path: /api/health

backend:
  replicaCount: 2
  image:
    repository: todo-backend
    tag: v1
    pullPolicy: IfNotPresent
  service:
    type: ClusterIP
    port: 8000
    mcpPort: 8001
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  healthCheck:
    enabled: true
    path: /api/health

config:
  backendUrl: "http://todo-backend-service:8000"
  logLevel: "info"

secrets:
  # These will be passed via --set flags or separate values file
  databaseUrl: ""
  openaiApiKey: ""
  authSecret: ""

ingress:
  enabled: false
  className: nginx
  annotations: {}
  hosts:
    - host: todo-local.dev
      paths:
        - path: /
          pathType: Prefix
Acceptance Criteria:

 Default values enable successful deployment
 All configurable parameters documented in values.yaml comments
 helm upgrade with new values works without recreation
 Secrets NOT included in values.yaml (passed separately)


3.3.3 Template Helpers
Requirement ID: FR-HELM-003
Priority: P2 (Medium)
Specification:
yaml# templates/_helpers.tpl
{{- define "todo-chatbot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "todo-chatbot.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{- define "todo-chatbot.labels" -}}
helm.sh/chart: {{ include "todo-chatbot.chart" . }}
{{ include "todo-chatbot.selectorLabels" . }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{- define "todo-chatbot.selectorLabels" -}}
app.kubernetes.io/name: {{ include "todo-chatbot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
Acceptance Criteria:

 Labels consistent across all resources
 Naming conventions follow Kubernetes best practices
 Templates reusable via include function


3.4 AI DevOps Integration Requirements
3.4.1 Gordon (Docker AI) Usage
Requirement ID: FR-AI-001
Priority: P1 (High)
Mandatory Use Cases:

Dockerfile Generation:

bash   docker ai "create optimized multi-stage Dockerfile for Next.js 16 with alpine base"

Image Building:

bash   docker ai "build frontend image with cache optimization and tag it as todo-frontend:v1"

Security Scanning:

bash   docker ai "scan todo-backend:v1 for vulnerabilities and suggest fixes"

Image Optimization:

bash   docker ai "analyze todo-frontend:v1 and suggest ways to reduce image size"
Documentation Requirement:

 Screenshot or log of each Gordon interaction
 Comparison of Gordon-generated vs manual Dockerfile
 Performance metrics (build time, image size)


3.4.2 kubectl-ai Usage
Requirement ID: FR-AI-002
Priority: P1 (High)
Mandatory Use Cases:

Deployment Creation:

bash   kubectl-ai "create deployment for todo-frontend with 2 replicas, 100m CPU request, 500m limit"

Service Creation:

bash   kubectl-ai "create NodePort service for frontend on port 3000, expose as 30080"

Troubleshooting:

bash   kubectl-ai "check why todo-backend pods are in CrashLoopBackOff"

Scaling:

bash   kubectl-ai "scale the backend deployment to handle 2x more load"

Resource Inspection:

bash   kubectl-ai "show me all resources related to todo-chatbot app"
Documentation Requirement:

 Command history with outputs
 At least 3 troubleshooting scenarios resolved with kubectl-ai
 Comparison with manual kubectl commands


3.4.3 Kagent Usage
Requirement ID: FR-AI-003
Priority: P2 (Medium)
Mandatory Use Cases:

Cluster Health Analysis:

bash   kagent "analyze cluster health and identify any issues"

Resource Optimization:

bash   kagent "suggest resource optimization for cost efficiency"

Deployment Strategy:

bash   kagent "review our deployment strategy and suggest improvements"
Documentation Requirement:

 Kagent analysis reports included in /docs
 Action items from Kagent recommendations (what was implemented)


4. Non-Functional Requirements
4.1 Performance
NFR-PERF-001: Application Response Time

Target: < 2 seconds for 95% of requests
Measurement: Load test with 10 concurrent users
Tool: Apache Bench or k6

NFR-PERF-002: Pod Startup Time

Target: Frontend pods ready within 30 seconds
Target: Backend pods ready within 20 seconds
Measurement: kubectl describe pod readiness probe times

NFR-PERF-003: Resource Utilization

Target: Frontend CPU < 300m under normal load
Target: Backend CPU < 600m under normal load
Target: Memory stable (no leaks after 1 hour run)

4.2 Reliability
NFR-REL-001: High Availability

Target: 99.9% uptime during deployment window
Mechanism: Rolling updates with maxUnavailable: 0

NFR-REL-002: Fault Tolerance

Requirement: Application survives single pod failure
Test: Kill 1 frontend pod, verify service continues

NFR-REL-003: Data Persistence

Requirement: Tasks persist across pod restarts
Test: Create task, delete pod, verify task exists

4.3 Security
NFR-SEC-001: No Hardcoded Secrets

Validation: git grep -i "password\|api_key\|secret" src/ returns no matches
Mechanism: All secrets via Kubernetes Secrets

NFR-SEC-002: Non-Root Containers

Requirement: All containers run as UID >= 1000
Validation: docker inspect <image> | jq '.[0].Config.User'

NFR-SEC-003: Image Vulnerability Score

Target: No HIGH or CRITICAL vulnerabilities
Tool: docker scan or Trivy

4.4 Maintainability
NFR-MAIN-001: Code Documentation

Requirement: Every Dockerfile has inline comments
Requirement: Every Helm template has description

NFR-MAIN-002: Deployment Automation

Target: Full deployment in < 5 commands
Example:

bash  minikube start
  docker build -t todo-frontend:v1 ./frontend
  docker build -t todo-backend:v1 ./backend
  kubectl create secret generic todo-secrets --from-env-file=.env
  helm install todo-chatbot ./helm-charts/todo-chatbot
NFR-MAIN-003: Runbook Completeness

Requirement: Covers 90% of common failure scenarios
Scenarios: Pod crash, image pull error, secret not found, health check failing, out of memory


5. Technical Specifications
5.1 Minikube Cluster Configuration
Specification:
bash#!/bin/bash
# scripts/setup-minikube.sh

# Start Minikube with specific resources
minikube start \
  --cpus=4 \
  --memory=8192 \
  --disk-size=20g \
  --driver=docker \
  --kubernetes-version=v1.28.0 \
  --addons=ingress,metrics-server

# Enable Docker daemon access (for local image builds)
eval $(minikube docker-env)

# Verify cluster
kubectl cluster-info
kubectl get nodes
Requirements:

 Minimum 4 CPU cores allocated
 Minimum 8GB RAM allocated
 Kubernetes version 1.26+
 Metrics server enabled for kubectl top


5.2 Docker Build Strategy
Frontend Build Script:
bash#!/bin/bash
# scripts/build-frontend.sh

# Use Minikube's Docker daemon
eval $(minikube docker-env)

# Build with BuildKit
DOCKER_BUILDKIT=1 docker build \
  -t todo-frontend:v1 \
  -f frontend/Dockerfile \
  --build-arg NODE_ENV=production \
  --progress=plain \
  ./frontend

# Verify image
docker images | grep todo-frontend
docker run --rm todo-frontend:v1 node --version
Backend Build Script:
bash#!/bin/bash
# scripts/build-backend.sh

eval $(minikube docker-env)

DOCKER_BUILDKIT=1 docker build \
  -t todo-backend:v1 \
  -f backend/Dockerfile \
  --build-arg PYTHON_VERSION=3.13 \
  --progress=plain \
  ./backend

docker images | grep todo-backend
docker run --rm todo-backend:v1 python --version

5.3 Deployment Workflow
Complete Deployment Script:
bash#!/bin/bash
# scripts/deploy.sh

set -e  # Exit on error

echo "=== Phase IV Deployment ==="

# Step 1: Verify prerequisites
echo "[1/7] Checking prerequisites..."
command -v minikube >/dev/null 2>&1 || { echo "minikube not installed"; exit 1; }
command -v helm >/dev/null 2>&1 || { echo "helm not installed"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "kubectl not installed"; exit 1; }

# Step 2: Start Minikube
echo "[2/7] Starting Minikube cluster..."
minikube status || minikube start --cpus=4 --memory=8192 --driver=docker

# Step 3: Build images
echo "[3/7] Building Docker images..."
eval $(minikube docker-env)
./scripts/build-frontend.sh
./scripts/build-backend.sh

# Step 4: Create secrets
echo "[4/7] Creating Kubernetes secrets..."
if [ ! -f .env ]; then
  echo "ERROR: .env file not found"
  exit 1
fi
kubectl create secret generic todo-secrets --from-env-file=.env --dry-run=client -o yaml | kubectl apply -f -

# Step 5: Deploy with Helm
echo "[5/7] Deploying with Helm..."
helm upgrade --install todo-chatbot ./helm-charts/todo-chatbot \
  --create-namespace \
  --namespace todo \
  --wait \
  --timeout 5m

# Step 6: Verify deployment
echo "[6/7] Verifying deployment..."
kubectl wait --for=condition=ready pod -l app=todo-chatbot -n todo --timeout=300s

# Step 7: Show access info
echo "[7/7] Deployment complete!"
MINIKUBE_IP=$(minikube ip)
echo ""
echo "==================================="
echo "Todo Chatbot is now running!"
echo "==================================="
echo "Frontend: http://$MINIKUBE_IP:30080"
echo "Backend API: http://$MINIKUBE_IP:30800"
echo ""
echo "Run 'kubectl get pods -n todo' to check status"
echo "Run 'kubectl logs -f <pod-name> -n todo' to view logs"

5.4 Health Check Endpoints
Frontend Health Check (Next.js):
typescript// frontend/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'todo-frontend',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
  };

  return NextResponse.json(health, { status: 200 });
}
Backend Health Check (FastAPI):
python# backend/main.py
from fastapi import FastAPI
from datetime import datetime
import time

app = FastAPI()
start_time = time.time()

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "todo-backend",
        "version": "1.0.0",
        "uptime": time.time() - start_time,
        "database": "connected",  # Add DB ping here
    }

5.5 Environment Variables Reference
VariableComponentSourceExampleRequiredDATABASE_URLBackendSecretpostgresql://user:pass@ep-xxx.neon.tech/todoYesOPENAI_API_KEYBackendSecretsk-proj-xxxYesBETTER_AUTH_SECRETBothSecretrandom-256-bit-stringYesNEXT_PUBLIC_API_URLFrontendConfigMaphttp://todo-backend-service:8000YesNEXT_PUBLIC_OPENAI_DOMAIN_KEYFrontendConfigMapdk-xxxYesNODE_ENVFrontendConfigMapproductionNo (default: production)LOG_LEVELBothConfigMapinfoNo (default: info)MCP_SERVER_PORTBackendConfigMap8001No (default: 8001)

6. Testing Requirements
6.1 Unit Tests (Container Level)
Test ID: TEST-UNIT-001
Description: Verify containers start successfully
bash# Test frontend container
docker run -d --name test-frontend \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  -p 3000:3000 \
  todo-frontend:v1

# Wait for startup
sleep 10

# Test health endpoint
curl -f http://localhost:3000/api/health || exit 1

# Cleanup
docker stop test-frontend && docker rm test-frontend
Acceptance Criteria:

 Container starts without errors
 Health endpoint returns 200 OK
 Process runs as non-root user


6.2 Integration Tests (Kubernetes Level)
Test ID: TEST-INT-001
Description: Verify frontend-backend communication
bash# Deploy application
helm install todo-chatbot ./helm-charts/todo-chatbot

# Wait for ready
kubectl wait --for=condition=ready pod -l component=frontend --timeout=120s

# Get frontend pod
FRONTEND_POD=$(kubectl get pods -l component=frontend -o jsonpath='{.items[0].metadata.name}')

# Test internal communication
kubectl exec $FRONTEND_POD -- curl -f http://todo-backend-service:8000/api/health
Acceptance Criteria:

 Frontend pod can resolve backend service DNS
 Backend responds to frontend requests
 No network policy blocking communication


Test ID: TEST-INT-002
Description: Verify database connectivity
bashBACKEND_POD=$(kubectl get pods -l component=backend -o jsonpath='{.items[0].metadata.name}')

# Test database connection (add this endpoint to backend)
kubectl exec $BACKEND_POD -- curl -f http://localhost:8000/api/db/ping
Acceptance Criteria:

 Backend can connect to Neon database
 Connection pool initialized
 Queries execute successfully


6.3 End-to-End Tests
Test ID: TEST-E2E-001
Description: Complete user workflow
bash#!/bin/bash
# tests/e2e-test.sh

MINIKUBE_IP=$(minikube ip)
BASE_URL="http://$MINIKUBE_IP:30080"

# Test 1: Load homepage
echo "Test 1: Homepage loads"
curl -f $BASE_URL || exit 1

# Test 2: Health check
echo "Test 2: Health check"
curl -f $BASE_URL/api/health || exit 1

# Test 3: Login (requires headless browser or API test)
echo "Test 3: User authentication"
# Add actual test here

# Test 4: Create task via chatbot
echo "Test 4: Create task"
# Add actual test here

# Test 5: Verify task persists
echo "Test 5: Task persistence"
# Kill pod and verify task still exists

echo "All E2E tests passed!"

6.4 Load Tests
Test ID: TEST-LOAD-001
Description: Application handles concurrent users
bash# Using k6 load testing tool
cat > load-test.js <<EOF
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },   // Stay at 10 users
    { duration: '30s', target: 0 },   // Ramp down
  ],
};

export default function() {
  let res = http.get('http://$(minikube ip):30080');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
EOF

k6 run load-test.js
Acceptance Criteria:

 95% of requests complete in < 2s
 0% error rate
 CPU usage stays under 80%
 No pod OOMKilled events


7. Documentation Requirements
7.1 README.md Structure
markdown# Todo Chatbot - Phase IV: Kubernetes Deployment

## Overview
[Brief description of Phase IV goals]

## Prerequisites
- [ ] Docker Desktop 4.53+ (with Gordon enabled)
- [ ] Minikube 1.32+
- [ ] kubectl 1.26+
- [ ] Helm 3.0+
- [ ] kubectl-ai (optional but recommended)
- [ ] Kagent (optional but recommended)
- [ ] 8GB+ available RAM
- [ ] 20GB+ available disk space

## Architecture
[Diagram showing pods, services, ingress]

## Quick Start
```bash
# 1. Clone repository
git clone 
cd hackathon-todo-phase4

# 2. Set up environment
cp .env.example .env
# Edit .env with your credentials

# 3. Deploy
./scripts/deploy.sh

# 4. Access application
minikube service todo-frontend-service -n todo
```

## Detailed Setup
### Step 1: Minikube
[Detailed instructions]

### Step 2: Docker Images
[Build instructions]

### Step 3: Kubernetes Deployment
[kubectl or Helm instructions]

### Step 4: Verification
[How to verify everything works]

## Troubleshooting
### Pods stuck in Pending
[Solution]

### ImagePullBackOff error
[Solution]

### Database connection failed
[Solution]

## Development
### Making Changes
[How to update code and redeploy]

### Viewing Logs
```bash
kubectl logs -f 
```

### Scaling
```bash
kubectl scale deployment todo-frontend --replicas=3
```

## Cleanup
```bash
helm uninstall todo-chatbot -n todo
minikube delete
```

## Phase IV Submission Checklist
- [ ] All containers build successfully
- [ ] Helm chart deploys without errors
- [ ] Application accessible via browser
- [ ] All Basic Level features work
- [ ] Gordon/kubectl-ai usage documented
- [ ] Demo video recorded (< 90 seconds)
```

---

### 7.2 Deployment Runbook

**File:** `docs/deployment-runbook.md`

**Required Sections:**
1. **Pre-Deployment Checklist**
   - Prerequisites verified
   - Credentials prepared
   - Cluster resources available

2. **Deployment Steps**
   - Numbered, sequential instructions
   - Expected output for each command
   - Verification checkpoints

3. **Post-Deployment Verification**
   - Health checks
   - Functional tests
   - Performance baseline

4. **Rollback Procedure**
   - How to revert to previous version
   - Helm rollback commands
   - Data recovery steps

5. **Common Issues**
   - Issue: Pod CrashLoopBackOff
     - Cause: ...
     - Solution: ...
   - Issue: ImagePullBackOff
     - Cause: ...
     - Solution: ...
   - (10+ scenarios)

---

### 7.3 Architecture Diagram

**Required Diagrams:**

**1. Component Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│                    MINIKUBE CLUSTER                         │
│                                                             │
│  ┌────────────────────┐      ┌────────────────────┐        │
│  │  Frontend Pod      │      │  Frontend Pod      │        │
│  │  ┌──────────────┐  │      │  ┌──────────────┐  │        │
│  │  │ Next.js App  │  │      │  │ Next.js App  │  │        │
│  │  │ Port: 3000   │  │      │  │ Port: 3000   │  │        │
│  │  └──────────────┘  │      │  └──────────────┘  │        │
│  └─────────┬──────────┘      └─────────┬──────────┘        │
│            │                           │                    │
│            └───────────┬───────────────┘                    │
│                        │                                    │
│                ┌───────▼────────┐                           │
│                │ Frontend Svc   │                           │
│                │ NodePort:30080 │                           │
│                └───────┬────────┘                           │
│                        │                                    │
│         ┌──────────────┴──────────────┐                    │
│         │                             │                    │
│  ┌──────▼─────────┐         ┌─────────▼──────┐            │
│  │ Backend Pod    │         │ Backend Pod    │            │
│  │ ┌────────────┐ │         │ ┌────────────┐ │            │
│  │ │ FastAPI    │ │         │ │ FastAPI    │ │            │
│  │ │ + MCP      │ │         │ │ + MCP      │ │            │
│  │ │ Port: 8000 │ │         │ │ Port: 8000 │ │            │
│  │ └────────────┘ │         │ └────────────┘ │            │
│  └────────┬───────┘         └────────┬───────┘            │
│           │                          │                     │
│           └──────────┬───────────────┘                     │
│                      │                                     │
│              ┌───────▼────────┐                            │
│              │ Backend Svc    │                            │
│              │ ClusterIP:8000 │                            │
│              └───────┬────────┘                            │
│                      │                                     │
└──────────────────────┼─────────────────────────────────────┘
                       │
                       │ External Connection
                       │
                 ┌─────▼──────┐
                 │ Neon DB    │
                 │ PostgreSQL │
                 └────────────┘
```

**2. Data Flow Diagram:**
```
User Browser
     │
     │ HTTP Request
     ▼
NodePort Service (30080)
     │
     │ Load Balance
     ▼
Frontend Pod (Next.js)
     │
     │ API Call
     ▼
Backend Service (ClusterIP:8000)
     │
     │ Forward
     ▼
Backend Pod (FastAPI)
     │
     ├─► OpenAI Agents SDK ──► MCP Tools
     │                              │
     │                              ▼
     └──────────────────────► SQLModel ORM
                                    │
                                    ▼
                              Neon Database

8. Acceptance Criteria Summary
8.1 Must-Have (Phase IV Completion)

 Containerization:

Frontend Docker image builds and runs
Backend Docker image builds and runs
Multi-stage builds implemented
Images under size targets (500MB/300MB)
Health check endpoints functional


 Kubernetes Deployment:

All pods reach Running state
2 replicas each for frontend and backend
Services expose correct ports
ConfigMaps and Secrets properly configured
Rolling updates work without downtime


 Helm Chart:

Chart passes helm lint
helm install deploys successfully
helm upgrade works seamlessly
values.yaml well-documented
Chart README comprehensive


 Application Functionality:

Todo Chatbot UI accessible
All Basic Level features working
Natural language commands functional
Better Auth login working
Tasks persist across pod restarts
Database connectivity confirmed


 AI DevOps Tools:

Gordon used for Docker operations (documented)
kubectl-ai used for K8s operations (documented)
Kagent used for cluster analysis (documented)
Alternative manual commands documented if tools unavailable


 Documentation:

README with complete setup instructions
Deployment runbook with 10+ troubleshooting scenarios
Architecture diagrams included
All specs updated


 Submission:

Public GitHub repo with all code
Demo video under 90 seconds
Deployed to Minikube (local validation)



8.2 Nice-to-Have (Bonus Consideration)

 Ingress controller configured
 Network policies defined
 Horizontal Pod Autoscaler configured
 Persistent Volume for logs
 Monitoring with Prometheus/Grafana
 CI/CD pipeline (basic)


9. Dependencies & Prerequisites
9.1 External Dependencies
DependencyVersionPurposeRequiredDocker Desktop4.53+Container runtime + GordonYesMinikube1.32+Local Kubernetes clusterYeskubectl1.26+Kubernetes CLIYesHelm3.0+Package managerYeskubectl-aiLatestAI-assisted K8s opsRecommendedKagentLatestCluster analysisRecommendedNeon AccountN/APostgreSQL databaseYesOpenAI AccountN/AAgents SDK + ChatKitYes
9.2 Phase Dependencies
Must Complete Before Phase IV:

 Phase I: Python console app
 Phase II: Full-stack web app
 Phase III: AI chatbot with MCP

Phase IV Deliverables Required for Phase V:

Dockerfiles (will be reused)
Kubernetes manifests (will be adapted)
Helm chart (will be extended)
Understanding of cloud-native patterns


10. Risk Assessment & Mitigation
RiskProbabilityImpactMitigationGordon unavailable in regionMediumLowProvide manual Dockerfile fallbackMinikube resource constraintsHighMediumDocument minimum specs, suggest cloud VMImage build failuresMediumHighMulti-stage builds, clear error messagesDatabase connection issuesMediumHighConnection string validation, retry logicHelm chart syntax errorsMediumMediumExtensive linting, dry-run before installPod scheduling failuresLowHighResource requests conservative, node affinity

11. Success Metrics
11.1 Quantitative Metrics
MetricTargetMeasurementDeployment Success Rate100%Helm install completes without errorsPod Ready Time< 2 minuteskubectl describe pod readiness timestampsApplication Response Time< 2s (p95)Load test resultsImage Build Time< 5 minutesCI/CD pipeline logs or local timerFrontend Image Size< 500MBdocker images outputBackend Image Size< 300MBdocker images outputHelm Chart Lint Score0 errorshelm lint outputDocumentation Completeness100%All sections in template filled
11.2 Qualitative Metrics
CriterionEvaluationCode OrganizationClear folder structure, logical separationSpec AdherenceAll requirements traceable to spec sectionsAI Tool IntegrationMeaningful use of Gordon/kubectl-ai/KagentError HandlingGraceful degradation, helpful error messagesDeployment ExperienceSmooth, well-documented, reproducible

12. Timeline & Milestones
Phase IV Duration: Dec 22, 2025 - Jan 4, 2026 (14 days)
Suggested Schedule:
DayMilestoneDeliverable1-2Specification & PlanningThis document, Plan, Tasks3-4ContainerizationDockerfiles, local testing5-6Kubernetes ManifestsDeployments, Services, ConfigMaps7-8Helm Chart DevelopmentChart structure, templates, values9-10Integration & TestingE2E tests, load tests11-12AI DevOps IntegrationGordon/kubectl-ai/Kagent usage13DocumentationREADME, runbook, diagrams14Demo Video & Submission90-second video, GitHub repo

13. Appendix
A. Glossary

MCP: Model Context Protocol - standard for AI agent tool integration
Minikube: Local Kubernetes cluster for development
Helm: Package manager for Kubernetes (like npm for K8s)
Gordon: Docker AI agent for intelligent container operations
kubectl-ai: AI-powered Kubernetes CLI
Kagent: Kubernetes agent for cluster analysis
NodePort: Kubernetes service type exposing port on all nodes
ClusterIP: Kubernetes service type for internal cluster communication

B. Reference Links

Kubernetes Documentation
Helm Documentation
Minikube Documentation
Docker Best Practices
Spec-Kit Plus

C. Sample .env File
bash# .env.example
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/todo?sslmode=require
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
BETTER_AUTH_SECRET=your-256-bit-secret-here
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=dk-xxxxxxxxxxxxx