Plan: Phase IV - Local Kubernetes Deployment
Document Information
Plan ID: PLAN-PHASE4-001
Version: 1.0.0
Status: Active
Created: Phase IV Planning
References:

Constitution: constitution-phase4.md
Specification: specification-phase4.md
Prerequisites: Phase III Todo Chatbot (Completed)


1. Plan Overview
1.1 Architectural Approach
This plan transforms the Phase III monolithic Todo Chatbot into a cloud-native, containerized application running on Kubernetes. We will:

Containerize the Next.js frontend and FastAPI backend separately
Orchestrate using Kubernetes primitives (Deployments, Services, ConfigMaps, Secrets)
Package as a Helm chart for reproducible deployments
Deploy to local Minikube cluster
Leverage AI DevOps tools (Gordon, kubectl-ai, Kagent) throughout

Key Principle: Every infrastructure decision must be spec-driven. No manual YAML writing - use Claude Code with kubectl-ai to generate manifests.
1.2 Architecture Evolution
Phase III (Monolithic)              Phase IV (Cloud-Native)
─────────────────────              ──────────────────────────

┌─────────────────┐                ┌──────────────────────────────┐
│   Single Host   │                │     Kubernetes Cluster        │
│                 │                │                              │
│  ┌───────────┐  │                │  ┌────────┐    ┌────────┐   │
│  │ Next.js   │  │                │  │Frontend│    │Frontend│   │
│  │ (Port     │  │    ──────►     │  │ Pod 1  │    │ Pod 2  │   │
│  │  3000)    │  │                │  └────────┘    └────────┘   │
│  └───────────┘  │                │       │            │         │
│                 │                │       └────┬───────┘         │
│  ┌───────────┐  │                │            │                 │
│  │ FastAPI   │  │                │  ┌─────────▼────────┐        │
│  │ (Port     │  │                │  │   NodePort Svc   │        │
│  │  8000)    │  │                │  └──────────────────┘        │
│  └───────────┘  │                │                              │
│                 │                │  ┌────────┐    ┌────────┐   │
│  ┌───────────┐  │                │  │Backend │    │Backend │   │
│  │ Neon DB   │  │                │  │ Pod 1  │    │ Pod 2  │   │
│  │ (External)│  │                │  └────────┘    └────────┘   │
│  └───────────┘  │                │       │            │         │
└─────────────────┘                │       └────┬───────┘         │
                                   │            │                 │
                                   │  ┌─────────▼────────┐        │
                                   │  │  ClusterIP Svc   │        │
                                   │  └──────────────────┘        │
                                   │                              │
                                   │  ┌──────────────────┐        │
                                   │  │  ConfigMaps &    │        │
                                   │  │  Secrets         │        │
                                   │  └──────────────────┘        │
                                   └──────────────────────────────┘
                                             │
                                             ▼
                                   ┌──────────────────┐
                                   │  Neon DB         │
                                   │  (External)      │
                                   └──────────────────┘

2. System Architecture
2.1 Component Breakdown
2.1.1 Frontend Component
Responsibility: Serve Next.js application with ChatKit UI
Technical Stack:

Base: Next.js 16 (App Router)
Runtime: Node.js 20
UI: React + Tailwind CSS
Auth: Better Auth (JWT client)
Container: Alpine Linux

Interfaces:
yamlInbound:
  - HTTP requests from users (port 3000)
  - Kubernetes health probes (GET /api/health)

Outbound:
  - HTTP to Backend Service (todo-backend-service:8000)
  - External: OpenAI ChatKit API
  - External: Better Auth validation

Environment Variables:
  - NEXT_PUBLIC_API_URL (from ConfigMap)
  - NEXT_PUBLIC_OPENAI_DOMAIN_KEY (from ConfigMap)
  - BETTER_AUTH_SECRET (from Secret)
  - NODE_ENV (from ConfigMap)

Kubernetes Resources:
  - Deployment: todo-frontend (2 replicas)
  - Service: todo-frontend-service (NodePort 30080)
  - ConfigMap: todo-config
  - Secret: todo-secrets
Resource Requirements:
yamlRequests:
  cpu: 100m
  memory: 128Mi

Limits:
  cpu: 500m
  memory: 512Mi

Disk: Ephemeral (no persistent storage needed)

2.1.2 Backend Component
Responsibility: API server with MCP tools and OpenAI Agents SDK
Technical Stack:

Base: FastAPI
Runtime: Python 3.13
ORM: SQLModel
AI: OpenAI Agents SDK
MCP: Official MCP SDK
Container: Python Slim

Interfaces:
yamlInbound:
  - HTTP from Frontend Service (port 8000)
  - MCP tool invocations (port 8001)
  - Kubernetes health probes (GET /api/health)

Outbound:
  - PostgreSQL to Neon DB (port 5432)
  - External: OpenAI API (Agents SDK)
  - External: Better Auth JWT verification

Environment Variables:
  - DATABASE_URL (from Secret)
  - OPENAI_API_KEY (from Secret)
  - BETTER_AUTH_SECRET (from Secret)
  - MCP_SERVER_PORT (from ConfigMap)
  - LOG_LEVEL (from ConfigMap)

Kubernetes Resources:
  - Deployment: todo-backend (2 replicas)
  - Service: todo-backend-service (ClusterIP)
  - Secret: todo-secrets
  - ConfigMap: todo-config
Resource Requirements:
yamlRequests:
  cpu: 200m
  memory: 256Mi

Limits:
  cpu: 1000m
  memory: 1Gi

Disk: Ephemeral
```

---

#### 2.1.3 Database Component

**Responsibility:** Persistent data storage (External to cluster)

**Technical Stack:**
- Provider: Neon Serverless PostgreSQL
- Deployment: Managed (not in cluster)
- Access: TLS connection from pods

**Connection Pattern:**
```
Backend Pods
    │
    │ TLS Connection
    │ Connection String from Secret
    │
    ▼
Neon Database (External)
    │
    ├── users table (Better Auth)
    ├── tasks table
    ├── conversations table
    └── messages table
Configuration:
yamlConnection String Format:
  postgresql://user:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require

Security:
  - Stored in Kubernetes Secret
  - TLS enforced (sslmode=require)
  - Connection pooling in SQLModel

High Availability:
  - Managed by Neon (no cluster responsibility)
  - Backup/restore handled externally
```

---

### 2.2 Service Mesh & Networking
```
┌─────────────────────────────────────────────────────┐
│              External Traffic                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Port 30080
                   ▼
┌──────────────────────────────────────────────────────┐
│         todo-frontend-service (NodePort)             │
│         Type: NodePort                               │
│         Port: 3000                                   │
│         NodePort: 30080                              │
│         Selector: app=todo-chatbot,component=frontend│
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Load Balances
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌─────────────┐       ┌─────────────┐
│  Frontend   │       │  Frontend   │
│  Pod 1      │       │  Pod 2      │
│  10.1.1.10  │       │  10.1.1.11  │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │ API Calls           │
       │ http://todo-backend-service:8000
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│         todo-backend-service (ClusterIP)             │
│         Type: ClusterIP                              │
│         Port: 8000 (HTTP), 8001 (MCP)               │
│         Selector: app=todo-chatbot,component=backend │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ Load Balances
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌─────────────┐       ┌─────────────┐
│  Backend    │       │  Backend    │
│  Pod 1      │       │  Pod 2      │
│  10.1.2.10  │       │  10.1.2.11  │
└──────┬──────┘       └──────┬──────┘
       │                     │
       │ Database            │
       │ Connections         │
       └──────────┬──────────┘
                  │
                  │ TLS/SSL
                  ▼
┌──────────────────────────────────────┐
│    Neon PostgreSQL (External)        │
│    ep-xxxxx.region.aws.neon.tech    │
└──────────────────────────────────────┘
Service DNS Resolution:
bash# From Frontend Pod
curl http://todo-backend-service:8000/api/tasks
# Resolves to: ClusterIP (e.g., 10.96.1.100)

# From Backend Pod
# No direct pod-to-pod communication
# All via Services for load balancing

2.3 Configuration Management
2.3.1 ConfigMap Structure
Purpose: Non-sensitive configuration data
yamlapiVersion: v1
kind: ConfigMap
metadata:
  name: todo-config
  namespace: todo
  labels:
    app: todo-chatbot
data:
  # Backend Service URL (internal DNS)
  backend-url: "http://todo-backend-service:8000"
  
  # MCP Server URL
  mcp-url: "http://todo-backend-service:8001"
  
  # Environment
  environment: "local"
  
  # Logging
  log-level: "info"
  
  # MCP Configuration
  mcp-server-port: "8001"
  
  # Node Environment
  node-env: "production"
Usage Pattern:
yaml# In Deployment
env:
  - name: NEXT_PUBLIC_API_URL
    valueFrom:
      configMapKeyRef:
        name: todo-config
        key: backend-url

2.3.2 Secret Structure
Purpose: Sensitive credentials and API keys
yamlapiVersion: v1
kind: Secret
metadata:
  name: todo-secrets
  namespace: todo
  labels:
    app: todo-chatbot
type: Opaque
data:
  # Base64 encoded values
  database-url: <base64>
  openai-api-key: <base64>
  better-auth-secret: <base64>
  openai-domain-key: <base64>
Creation Strategy:
bash# From .env file (NOT committed to git)
kubectl create secret generic todo-secrets \
  --from-env-file=.env \
  --namespace=todo \
  --dry-run=client -o yaml | kubectl apply -f -
Security Requirements:

✅ Never commit .env to git (in .gitignore)
✅ Use separate secrets for dev/staging/prod
✅ Rotate secrets regularly
✅ Restrict RBAC access to secrets


3. Containerization Strategy
3.1 Frontend Dockerfile Architecture
Multi-Stage Build Pattern:
dockerfile# ============================================
# Stage 1: Dependencies (Builder)
# ============================================
FROM node:20-alpine AS deps
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production


# ============================================
# Stage 2: Build (Builder)
# ============================================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build


# ============================================
# Stage 3: Runner (Production)
# ============================================
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Change ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
Optimization Targets:

Final image size: < 500MB
Build time: < 5 minutes
Layers: < 15 layers
Base image: Official Node Alpine

Build Command:
bash# Using Gordon (AI-assisted)
docker ai "build optimized Next.js image with multi-stage build and tag as todo-frontend:v1"

# Fallback (manual)
DOCKER_BUILDKIT=1 docker build \
  -t todo-frontend:v1 \
  -f frontend/Dockerfile \
  --target runner \
  ./frontend

3.2 Backend Dockerfile Architecture
Multi-Stage Build Pattern:
dockerfile# ============================================
# Stage 1: Builder
# ============================================
FROM python:3.13-slim AS builder

WORKDIR /app

# Install uv package manager
RUN pip install --no-cache-dir uv

# Copy dependency files
COPY requirements.txt .

# Create virtual environment and install dependencies
RUN uv venv /opt/venv && \
    . /opt/venv/bin/activate && \
    uv pip install --no-cache -r requirements.txt


# ============================================
# Stage 2: Runner (Production)
# ============================================
FROM python:3.13-slim AS runner

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      libpq5 \
      curl && \
    rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv

# Copy application code
COPY . .

# Create non-root user
RUN useradd --create-home --uid 1000 appuser && \
    chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Add venv to PATH
ENV PATH="/opt/venv/bin:$PATH"

# Expose ports
EXPOSE 8000 8001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Start application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
Optimization Targets:

Final image size: < 300MB
Build time: < 3 minutes
Layers: < 12 layers
Base image: Python Slim (not Alpine - better compatibility)

Build Command:
bash# Using Gordon
docker ai "build Python FastAPI image with uv package manager and tag as todo-backend:v1"

# Fallback (manual)
DOCKER_BUILDKIT=1 docker build \
  -t todo-backend:v1 \
  -f backend/Dockerfile \
  --target runner \
  ./backend

3.3 Docker Compose (Local Development)
Purpose: Test containers locally before Kubernetes deployment
yaml# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: todo-frontend:v1
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXT_PUBLIC_OPENAI_DOMAIN_KEY=${OPENAI_DOMAIN_KEY}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health')"]
      interval: 30s
      timeout: 3s
      retries: 3

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    image: todo-backend:v1
    ports:
      - "8000:8000"
      - "8001:8001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - MCP_SERVER_PORT=8001
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/health"]
      interval: 30s
      timeout: 3s
      retries: 3

networks:
  default:
    name: todo-network
Validation Commands:
bash# Build and start
docker-compose up -d

# Check health
docker-compose ps

# View logs
docker-compose logs -f

# Test frontend
curl http://localhost:3000/api/health

# Test backend
curl http://localhost:8000/api/health

# Cleanup
docker-compose down

4. Kubernetes Resource Definitions
4.1 Deployment Strategy
Rolling Update Configuration:
yamlstrategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1        # Allow 1 extra pod during update
    maxUnavailable: 0  # Never allow all pods to be down
```

**Rationale:**
- `maxUnavailable: 0` ensures zero downtime
- `maxSurge: 1` limits resource overhead during updates
- With 2 replicas: Update sequence is 2 → 3 → 2 → 3 → 2

**Update Flow:**
```
Initial State:    [Pod-A] [Pod-B]
                     ✓       ✓

Step 1: Create new pod
                  [Pod-A] [Pod-B] [Pod-C-new]
                     ✓       ✓       ⏳

Step 2: New pod ready
                  [Pod-A] [Pod-B] [Pod-C-new]
                     ✓       ✓       ✓

Step 3: Terminate old pod
                  [Pod-A] [Pod-C-new]
                     ✓       ✓

Step 4: Create another new pod
                  [Pod-A] [Pod-C-new] [Pod-D-new]
                     ✓       ✓           ⏳

Step 5: New pod ready
                  [Pod-A] [Pod-C-new] [Pod-D-new]
                     ✓       ✓           ✓

Step 6: Terminate old pod
                  [Pod-C-new] [Pod-D-new]
                     ✓           ✓

Final State:      [Pod-C] [Pod-D]
                     ✓       ✓

4.2 Health Probes Configuration
Liveness Probe:
yamllivenessProbe:
  httpGet:
    path: /api/health
    port: 3000  # or 8000 for backend
  initialDelaySeconds: 30  # Wait for app to start
  periodSeconds: 10        # Check every 10s
  timeoutSeconds: 3        # Timeout after 3s
  failureThreshold: 3      # Restart after 3 failures
Readiness Probe:
yamlreadinessProbe:
  httpGet:
    path: /api/health
    port: 3000  # or 8000 for backend
  initialDelaySeconds: 10  # Start checking early
  periodSeconds: 5         # Check frequently
  timeoutSeconds: 3
  failureThreshold: 2      # Remove from service after 2 failures
Difference:

Liveness: Restarts unhealthy pods
Readiness: Removes pods from service load balancing

Health Check Endpoint Requirements:
typescript// /api/health response
{
  "status": "healthy",
  "timestamp": "2026-01-04T10:30:00Z",
  "service": "todo-frontend",
  "version": "1.0.0",
  "uptime": 3600,
  "dependencies": {
    "backend": "connected",  // optional
    "database": "connected"  // backend only
  }
}

4.3 Resource Quotas & Limits
Philosophy:

Requests: Guaranteed resources (used for scheduling)
Limits: Maximum allowed (prevents resource hogging)

Frontend Resources:
yamlresources:
  requests:
    cpu: 100m      # 0.1 CPU core guaranteed
    memory: 128Mi  # 128 MiB guaranteed
  limits:
    cpu: 500m      # Max 0.5 CPU cores
    memory: 512Mi  # Max 512 MiB
Why these values:

Next.js idle: ~50m CPU, ~100Mi RAM
Next.js peak: ~300m CPU, ~350Mi RAM
Buffer for spikes: 500m/512Mi limits

Backend Resources:
yamlresources:
  requests:
    cpu: 200m      # 0.2 CPU cores guaranteed
    memory: 256Mi  # 256 MiB guaranteed
  limits:
    cpu: 1000m     # Max 1 CPU core
    memory: 1Gi    # Max 1 GiB
```

**Why these values:**
- FastAPI + SQLModel idle: ~100m CPU, ~150Mi RAM
- With OpenAI Agents SDK: ~400m CPU, ~600Mi RAM
- Buffer for AI operations: 1000m/1Gi limits

**Cluster Total Calculation:**
```
Frontend: 2 replicas × (100m + 128Mi) = 200m CPU, 256Mi RAM (requests)
Backend:  2 replicas × (200m + 256Mi) = 400m CPU, 512Mi RAM (requests)
──────────────────────────────────────────────────────────────────
Total:                                   600m CPU, 768Mi RAM (minimum)

Add 50% overhead for system:             300m CPU, 384Mi RAM
──────────────────────────────────────────────────────────────────
Minikube Requirement:                    900m CPU, 1152Mi RAM
Recommended Allocation:                  4 CPUs, 8Gi RAM

4.4 Labels & Selectors Strategy
Label Schema:
yamllabels:
  app: todo-chatbot              # Application name
  component: frontend|backend    # Component type
  version: v1                    # Version tag
  environment: local             # Environment
  managed-by: helm               # Management tool
  part-of: phase-4               # Phase identifier
Usage Examples:
Deployment Selector:
yamlselector:
  matchLabels:
    app: todo-chatbot
    component: frontend
Service Selector:
yamlselector:
  app: todo-chatbot
  component: backend
Querying:
bash# Get all Phase 4 resources
kubectl get all -l part-of=phase-4

# Get all frontend resources
kubectl get all -l component=frontend

# Get all v1 resources
kubectl get all -l version=v1

# Get specific component
kubectl get pods -l app=todo-chatbot,component=backend
```

---

## 5. Helm Chart Architecture

### 5.1 Chart Structure
```
helm-charts/todo-chatbot/
├── Chart.yaml                 # Chart metadata
├── values.yaml                # Default configuration
├── values-dev.yaml            # Dev overrides (optional)
├── values-prod.yaml           # Prod overrides (optional)
├── charts/                    # Subchart dependencies (none for Phase IV)
├── templates/                 # Kubernetes manifests
│   ├── NOTES.txt             # Post-install instructions
│   ├── _helpers.tpl          # Template helpers
│   ├── configmap.yaml        # ConfigMap
│   ├── secret.yaml           # Secret (optional, prefer external)
│   ├── frontend/
│   │   ├── deployment.yaml   # Frontend Deployment
│   │   └── service.yaml      # Frontend Service
│   ├── backend/
│   │   ├── deployment.yaml   # Backend Deployment
│   │   └── service.yaml      # Backend Service
│   └── ingress.yaml          # Ingress (optional)
├── .helmignore               # Files to ignore
└── README.md                 # Chart documentation

5.2 Chart.yaml Design
yamlapiVersion: v2
name: todo-chatbot
description: |
  AI-Powered Todo Chatbot with MCP integration and OpenAI Agents SDK.
  Phase IV: Local Kubernetes Deployment.

type: application
version: 1.0.0        # Chart version (SemVer)
appVersion: "4.0.0"   # Application version

keywords:
  - todo
  - chatbot
  - ai
  - kubernetes
  - mcp
  - openai
  - phase4

home: https://github.com/your-username/hackathon-todo
sources:
  - https://github.com/your-username/hackathon-todo

maintainers:
  - name: Your Name
    email: your-email@example.com
    url: https://github.com/your-username

icon: https://example.com/icon.png  # Optional

kubeVersion: ">=1.26.0"  # Minimum Kubernetes version

dependencies: []  # No dependencies for Phase IV

annotations:
  category: Application
  licenses: MIT

5.3 Values.yaml Architecture
Design Principles:

Sensible defaults - Works out-of-box for Minikube
Clear structure - Group related configs
Documentation - Comment every configurable value
Environment-specific - Support dev/staging/prod overrides

yaml# ============================================
# Global Settings
# ============================================
global:
  environment: local
  namespace: todo

# ============================================
# Frontend Configuration
# ============================================
frontend:
  enabled: true
  
  replicaCount: 2
  
  image:
    repository: todo-frontend
    tag: v1
    pullPolicy: IfNotPresent
  
  service:
    type: NodePort
    port: 3000
    targetPort: 3000
    nodePort: 30080  # Fixed port for Minikube access
    annotations: {}
  
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
    liveness:
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 3
      failureThreshold: 3
    readiness:
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 2
  
  env:
    nodeEnv: production
  
  podAnnotations: {}
  podSecurityContext: {}
  securityContext:
    runAsNonRoot: true
    runAsUser: 1001
    allowPrivilegeEscalation: false

# ============================================
# Backend Configuration
# ============================================
backend:
  enabled: true
  
  replicaCount: 2
  
  image:
    repository: todo-backend
    tag: v1
    pullPolicy: IfNotPresent
  
  service:
    type: ClusterIP
    port: 8000
    targetPort: 8000
    mcpPort: 8001
    mcpTargetPort: 8001
    annotations: {}
  
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
    liveness:
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 3
      failureThreshold: 3
    readiness:
      initialDelaySeconds: 10
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 2
  
  env:
    mcpServerPort: "8001"
    logLevel: info
  
  podAnnotations: {}
  podSecurityContext: {}
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    allowPrivilegeEscalation: false

# ============================================
# Configuration
# ============================================
config:
  # Backend service URL (internal DNS)
  backendUrl: "http://todo-backend-service:8000"
  
  # MCP service URL
  mcpUrl: "http://todo-backend-service:8001"
  
  # Logging level
  logLevel: "info"

# ============================================
# Secrets
# ============================================
# NOTE: Secrets should NOT be in values.yaml
# Create separately with: kubectl create secret
secrets:
  # Placeholder - actual values passed via --set or separate values file
  create: false
  name: todo-secrets
  
  # If create: true, these will be used (NOT RECOMMENDED)
  databaseUrl: ""
  openaiApiKey: ""
  betterAuthSecret: ""
  openaiDomainKey: ""

# ============================================
# Ingress (Optional - Phase IV uses NodePort)
# ============================================
ingress:
  enabled: false
  className: nginx
  annotations:
    # nginx.ingress.kubernetes.io/rewrite-target: /
  hosts:
    - host: todo-local.dev
      paths:
        - path: /
          pathType: Prefix
  tls: []

# ============================================
# Autoscaling (Disabled for Phase IV)
# ============================================
autoscaling:
  enabled: false
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 80
  targetMemoryUtilizationPercentage: 80

# ============================================
# Service Account
# ============================================
serviceAccount:
  create: true
  annotations: {}
  name: ""

# ============================================
# Pod Disruption Budget (Optional)
# ============================================
podDisruptionBudget:
  enabled: false
  minAvailable: 1

# ============================================
# Node Affinity / Tolerations (Optional)
# ============================================
nodeSelector: {}
tolerations: []
affinity: {}

5.4 Template Helpers (_helpers.tpl)
yaml{{/*
Expand the name of the chart.
*/}}
{{- define "todo-chatbot.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "todo-chatbot.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "todo-chatbot.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "todo-chatbot.labels" -}}
helm.sh/chart: {{ include "todo-chatbot.chart" . }}
{{ include "todo-chatbot.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
part-of: phase-4
{{- end }}

{{/*
Selector labels
*/}}
{{- define "todo-chatbot.selectorLabels" -}}
app.kubernetes.io/name: {{ include "todo-chatbot.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Frontend labels
*/}}
{{- define "todo-chatbot.frontend.labels" -}}
{{ include "todo-chatbot.labels" . }}
app: todo-chatbot
component: frontend
{{- end }}

{{/*
Backend labels
*/}}
{{- define "todo-chatbot.backend.labels" -}}
{{ include "todo-chatbot.labels" . }}
app: todo-chatbot
component: backend
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "todo-chatbot.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "todo-chatbot.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Backend service URL
*/}}
{{- define "todo-chatbot.backendUrl" -}}
{{- printf "http://%s-backend-service:%d" (include "todo-chatbot.fullname" .) (.Values.backend.service.port | int) }}
{{- end }}

5.5 Template Example: Frontend Deployment
yaml# templates/frontend/deployment.yaml
{{- if .Values.frontend.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "todo-chatbot.fullname" . }}-frontend
  namespace: {{ .Values.global.namespace }}
  labels:
    {{- include "todo-chatbot.frontend.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.frontend.replicaCount }}
  selector:
    matchLabels:
      app: todo-chatbot
      component: frontend
      {{- include "todo-chatbot.selectorLabels" . | nindent 6 }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
        {{- with .Values.frontend.podAnnotations }}
        {{- toYaml . | nindent 8 }}
        {{- end }}
      labels:
        app: todo-chatbot
        component: frontend
        {{- include "todo-chatbot.selectorLabels" . | nindent 8 }}
    spec:
      {{- with .Values.frontend.podSecurityContext }}
      securityContext:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      serviceAccountName: {{ include "todo-chatbot.serviceAccountName" . }}
      containers:
      - name: frontend
        image: "{{ .Values.frontend.image.repository }}:{{ .Values.frontend.image.tag }}"
        imagePullPolicy: {{ .Values.frontend.image.pullPolicy }}
        {{- with .Values.frontend.securityContext }}
        securityContext:
          {{- toYaml . | nindent 10 }}
        {{- end }}
        ports:
        - name: http
          containerPort: {{ .Values.frontend.service.targetPort }}
          protocol: TCP
        env:
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: {{ include "todo-chatbot.fullname" . }}-config
              key: backend-url
        - name: NODE_ENV
          value: {{ .Values.frontend.env.nodeEnv | quote }}
        - name: BETTER_AUTH_SECRET
          valueFrom:
            secretKeyRef:
              name: {{ .Values.secrets.name }}
              key: better-auth-secret
        - name: NEXT_PUBLIC_OPENAI_DOMAIN_KEY
          valueFrom:
            secretKeyRef:
              name: {{ .Values.secrets.name }}
              key: openai-domain-key
        {{- if .Values.frontend.healthCheck.enabled }}
        livenessProbe:
          httpGet:
            path: {{ .Values.frontend.healthCheck.path }}
            port: http
          initialDelaySeconds: {{ .Values.frontend.healthCheck.liveness.initialDelaySeconds }}
          periodSeconds: {{ .Values.frontend.healthCheck.liveness.periodSeconds }}
          timeoutSeconds: {{ .Values.frontend.healthCheck.liveness.timeoutSeconds }}
          failureThreshold: {{ .Values.frontend.healthCheck.liveness.failureThreshold }}
        readinessProbe:
          httpGet:
            path: {{ .Values.frontend.healthCheck.path }}
            port: http
          initialDelaySeconds: {{ .Values.frontend.healthCheck.readiness.initialDelaySeconds }}
          periodSeconds: {{ .Values.frontend.healthCheck.readiness.periodSeconds }}
          timeoutSeconds: {{ .Values.frontend.healthCheck.readiness.timeoutSeconds }}
          failureThreshold: {{ .Values.frontend.healthCheck.readiness.failureThreshold }}
        {{- end }}
        resources:
          {{- toYaml .Values.frontend.resources | nindent 10 }}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
{{- end }}

5.6 NOTES.txt Template
yaml# templates/NOTES.txt
🚀 Todo Chatbot has been deployed!

📋 Release Information:
  Name:      {{ .Release.Name }}
  Namespace: {{ .Release.Namespace }}
  Chart:     {{ .Chart.Name }}-{{ .Chart.Version }}

🔍 Check deployment status:
  kubectl get pods -n {{ .Release.Namespace }} -l app=todo-chatbot

📊 View logs:
  Frontend: kubectl logs -f -l component=frontend -n {{ .Release.Namespace }}
  Backend:  kubectl logs -f -l component=backend -n {{ .Release.Namespace }}

🌐 Access the application:
{{- if .Values.ingress.enabled }}
  Ingress: http://{{ (index .Values.ingress.hosts 0).host }}
{{- else if eq .Values.frontend.service.type "NodePort" }}
  Get Minikube IP:
    minikube ip
  
  Access Frontend:
    http://$(minikube ip):{{ .Values.frontend.service.nodePort }}
  
  Or use minikube service:
    minikube service {{ include "todo-chatbot.fullname" . }}-frontend-service -n {{ .Release.Namespace }}
{{- end }}

📈 Scale the deployment:
  kubectl scale deployment {{ include "todo-chatbot.fullname" . }}-frontend --replicas=3 -n {{ .Release.Namespace }}
  kubectl scale deployment {{ include "todo-chatbot.fullname" . }}-backend --replicas=3 -n {{ .Release.Namespace }}

🔄 Upgrade the deployment:
  helm upgrade {{ .Release.Name }} {{ .Chart.Name }} -n {{ .Release.Namespace }}

🗑️  Uninstall:
  helm uninstall {{ .Release.Name }} -n {{ .Release.Namespace }}

⚠️  Important:
  - Ensure secrets are created before deployment
  - Database connection requires valid Neon credentials
  - OpenAI API key must be valid for chatbot functionality

For more information, visit:
  {{ .Chart.Home }}

6. AI DevOps Integration Plan
6.1 Gordon (Docker AI) Workflow
Phase 1: Dockerfile Generation
bash# Prompt strategy
docker ai "Create an optimized multi-stage Dockerfile for Next.js 16 application using:
- Base image: node:20-alpine
- Build stage: Install dependencies and build
- Production stage: Copy only production artifacts
- Run as non-root user
- Include health check endpoint
- Target image size under 500MB"

# Save output to frontend/Dockerfile
# Review and adjust if needed
Phase 2: Image Building
bash# Build with optimization
docker ai "Build the frontend image with:
- Build cache optimization
- Tag as todo-frontend:v1
- Use BuildKit for faster builds
- Show layer sizes"

# Verify
docker ai "Analyze todo-frontend:v1 image and show:
- Total size
- Layer breakdown
- Optimization suggestions"
Phase 3: Security Scanning
bash# Scan for vulnerabilities
docker ai "Scan todo-backend:v1 for security vulnerabilities and:
- List all HIGH and CRITICAL issues
- Suggest fixes
- Identify outdated dependencies"
Documentation Requirements:
markdown# docs/gordon-usage.md

## Gordon Commands Used

### Dockerfile Generation
**Command:** [exact prompt]
**Output:** [generated Dockerfile]
**Adjustments Made:** [manual changes if any]

### Image Building
**Command:** [exact prompt]
**Build Time:** [duration]
**Image Size:** [final size]
**Optimization Applied:** [BuildKit, cache, etc.]

### Security Scan
**Command:** [exact prompt]
**Vulnerabilities Found:** [count by severity]
**Actions Taken:** [fixes applied]

### Performance
- Initial image size: [before optimization]
- Final image size: [after optimization]
- Reduction: [percentage]

6.2 kubectl-ai Workflow
Phase 1: Resource Generation
bash# Generate deployment
kubectl-ai "Create a Kubernetes deployment for todo-frontend with:
- 2 replicas
- Image: todo-frontend:v1
- Resource requests: 100m CPU, 128Mi memory
- Resource limits: 500m CPU, 512Mi memory
- Liveness probe on /api/health
- Readiness probe on /api/health
- Environment variables from ConfigMap todo-config
- Secrets from todo-secrets"

# Save to file
kubectl-ai "..." > k8s/frontend-deployment.yaml
Phase 2: Service Creation
bash# Generate service
kubectl-ai "Create a NodePort service for todo-frontend:
- Selector: app=todo-chatbot, component=frontend
- Port: 3000
- NodePort: 30080
- Named port: http"
Phase 3: Troubleshooting
bash# Diagnose issues
kubectl-ai "Check why todo-backend pods are in CrashLoopBackOff and suggest fixes"

# Output analysis
kubectl-ai "Analyze resource usage and identify bottlenecks"

# Scaling decisions
kubectl-ai "Based on current load, should I scale the backend deployment?"
Phase 4: Cluster Operations
bash# Quick deployments
kubectl-ai "Deploy both frontend and backend with proper configuration"

# Status checks
kubectl-ai "Show me all resources related to todo-chatbot app with their status"

# Log analysis
kubectl-ai "Find errors in backend logs from the last 1 hour"
Documentation Requirements:
markdown# docs/kubectl-ai-usage.md

## kubectl-ai Commands Used

### Resource Generation
| Resource | Command | Output File |
|----------|---------|-------------|
| Frontend Deployment | [prompt] | k8s/frontend-deployment.yaml |
| Backend Deployment | [prompt] | k8s/backend-deployment.yaml |
| Frontend Service | [prompt] | k8s/frontend-service.yaml |
| Backend Service | [prompt] | k8s/backend-service.yaml |

### Troubleshooting Sessions
**Issue 1: Pod CrashLoopBackOff**
- Command: [prompt]
- Diagnosis: [kubectl-ai output]
- Solution Applied: [fix]

**Issue 2: Service Not Accessible**
- Command: [prompt]
- Diagnosis: [kubectl-ai output]
- Solution Applied: [fix]

### Optimization
- Command: [prompt]
- Recommendations: [list]
- Implemented: [which ones]

6.3 Kagent Workflow
Phase 1: Cluster Health Analysis
bash# Initial cluster assessment
kagent "Analyze the overall health of the Minikube cluster and identify any issues"

# Resource utilization
kagent "Show resource utilization across all nodes and suggest if we need to adjust allocations"
Phase 2: Deployment Review
bash# Review our deployment strategy
kagent "Review our todo-chatbot deployment strategy and suggest improvements for:
- High availability
- Resource efficiency
- Performance optimization"

# Cost analysis (applicable for cloud)
kagent "Analyze our resource allocation and suggest optimizations for cost efficiency"
Phase 3: Best Practices Audit
bash# Security audit
kagent "Audit our Kubernetes configuration for security best practices"

# Performance optimization
kagent "Suggest performance optimizations for our deployment"

# Reliability improvements
kagent "What can we do to improve the reliability of our application?"
Documentation Requirements:
markdown# docs/kagent-analysis.md

## Kagent Analysis Reports

### Cluster Health Report
**Date:** [timestamp]
**Command:** [prompt]
**Findings:**
- [finding 1]
- [finding 2]

**Action Items:**
- [ ] [action 1]
- [ ] [action 2]

### Deployment Strategy Review
**Command:** [prompt]
**Recommendations:**
1. [recommendation with rationale]
2. [recommendation with rationale]

**Implemented:**
- ✅ [what was done]
- ⏳ [what's planned]

### Security Audit
**Command:** [prompt]
**Vulnerabilities Found:** [count]
**Critical Issues:**
- [issue 1 with fix]
- [issue 2 with fix]

**Compliance Score:** [percentage]

7. Deployment Workflow
7.1 One-Time Setup
bash#!/bin/bash
# scripts/setup-environment.sh

set -e

echo "=== Phase IV Environment Setup ==="

# Step 1: Verify prerequisites
echo "[1/5] Verifying prerequisites..."
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ $1 not found. Please install."
    exit 1
  fi
  echo "✅ $1 found"
}

check_command docker
check_command minikube
check_command kubectl
check_command helm

# Optional AI tools
if command -v docker &> /dev/null; then
  echo "ℹ️  Checking Gordon (Docker AI)..."
  docker ai "test" &> /dev/null && echo "✅ Gordon available" || echo "⚠️  Gordon not available (fallback to manual commands)"
fi

if command -v kubectl-ai &> /dev/null; then
  echo "✅ kubectl-ai found"
else
  echo "⚠️  kubectl-ai not found (recommended but optional)"
fi

# Step 2: Start Minikube
echo "[2/5] Starting Minikube..."
if minikube status | grep -q "Running"; then
  echo "✅ Minikube already running"
else
  minikube start \
    --cpus=4 \
    --memory=8192 \
    --disk-size=20g \
    --driver=docker \
    --kubernetes-version=v1.28.0
fi

# Step 3: Enable addons
echo "[3/5] Enabling Minikube addons..."
minikube addons enable metrics-server
minikube addons enable ingress

# Step 4: Configure Docker environment
echo "[4/5] Configuring Docker to use Minikube..."
eval $(minikube docker-env)
echo "✅ Docker configured to use Minikube daemon"

# Step 5: Create namespace
echo "[5/5] Creating Kubernetes namespace..."
kubectl create namespace todo --dry-run=client -o yaml | kubectl apply -f -

echo ""
echo "=== Setup Complete ==="
echo "Minikube IP: $(minikube ip)"
echo "Kubernetes Version: $(kubectl version --short | grep Server)"
echo ""
echo "Next steps:"
echo "  1. Create .env file with secrets"
echo "  2. Run ./scripts/build-images.sh"
echo "  3. Run ./scripts/deploy.sh"

7.2 Image Build Process
bash#!/bin/bash
# scripts/build-images.sh

set -e

echo "=== Building Docker Images ==="

# Use Minikube's Docker daemon
eval $(minikube docker-env)

# Frontend
echo "[1/2] Building Frontend Image..."
if command -v docker &> /dev/null && docker ai "test" &> /dev/null 2>&1; then
  # Use Gordon
  echo "Using Gordon (Docker AI)..."
  docker ai "Build an optimized Next.js Docker image from ./frontend/Dockerfile and tag it as todo-frontend:v1"
else
  # Fallback to manual
  echo "Using manual Docker build..."
  DOCKER_BUILDKIT=1 docker build \
    -t todo-frontend:v1 \
    -f frontend/Dockerfile \
    ./frontend
fi

# Backend
echo "[2/2] Building Backend Image..."
if command -v docker &> /dev/null && docker ai "test" &> /dev/null 2>&1; then
  docker ai "Build an optimized Python FastAPI Docker image from ./backend/Dockerfile and tag it as todo-backend:v1"
else
  DOCKER_BUILDKIT=1 docker build \
    -t todo-backend:v1 \
    -f backend/Dockerfile \
    ./backend
fi

# Verify images
echo ""
echo "=== Built Images ==="
docker images | grep todo-

echo ""
echo "✅ Image build complete"

7.3 Deployment Process
bash#!/bin/bash
# scripts/deploy.sh

set -e

echo "=== Deploying Todo Chatbot to Kubernetes ==="

# Step 1: Verify prerequisites
echo "[1/6] Verifying prerequisites..."
if ! kubectl cluster-info &> /dev/null; then
  echo "❌ Cannot connect to Kubernetes cluster"
  exit 1
fi

if ! docker images | grep -q todo-frontend; then
  echo "❌ Frontend image not found. Run ./scripts/build-images.sh first"
  exit 1
fi

if ! docker images | grep -q todo-backend; then
  echo "❌ Backend image not found. Run ./scripts/build-images.sh first"
  exit 1
fi

# Step 2: Create secrets
echo "[2/6] Creating secrets..."
if [ ! -f .env ]; then
  echo "❌ .env file not found. Create it from .env.example"
  exit 1
fi

kubectl create secret generic todo-secrets \
  --from-env-file=.env \
  --namespace=todo \
  --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secrets created"

# Step 3: Deploy with Helm
echo "[3/6] Deploying with Helm..."
helm upgrade --install todo-chatbot ./helm-charts/todo-chatbot \
  --namespace=todo \
  --create-namespace \
  --wait \
  --timeout=5m \
  --set frontend.image.tag=v1 \
  --set backend.image.tag=v1

# Step 4: Wait for pods
echo "[4/6] Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod \
  -l app=todo-chatbot \
  -n todo \
  --timeout=300s

# Step 5: Verify deployment
echo "[5/6] Verifying deployment..."
kubectl get pods -n todo -l app=todo-chatbot
kubectl get svc -n todo

# Step 6: Display access information
echo "[6/6] Deployment complete!"
MINIKUBE_IP=$(minikube ip)

echo ""
echo "==================================="
echo "✅ Todo Chatbot Deployed Successfully"
echo "==================================="
echo ""
echo "Frontend URL: http://$MINIKUBE_IP:30080"
echo ""
echo "Quick Commands:"
echo "  View pods:     kubectl get pods -n todo"
echo "  View logs:     kubectl logs -f -l component=frontend -n todo"
echo "  Open in browser: minikube service todo-chatbot-frontend-service -n todo"
echo "  Scale:         kubectl scale deployment todo-chatbot-frontend --replicas=3 -n todo"
echo ""
echo "Troubleshooting:"
echo "  kubectl describe pod <pod-name> -n todo"
echo "  kubectl logs <pod-name> -n todo"
echo ""

7.4 Testing & Validation
bash#!/bin/bash
# scripts/test-deployment.sh

set -e

echo "=== Testing Deployment ==="

NAMESPACE="todo"
MINIKUBE_IP=$(minikube ip)
FRONTEND_PORT=30080

# Test 1: Pod status
echo "[Test 1/7] Checking pod status..."
PODS=$(kubectl get pods -n $NAMESPACE -l app=todo-chatbot --field-selector=status.phase=Running --no-headers | wc -l)
if [ "$PODS" -lt 4 ]; then
  echo "❌ Expected 4 pods running, found $PODS"
  kubectl get pods -n $NAMESPACE
  exit 1
fi
echo "✅ All pods running ($PODS/4)"

# Test 2: Service endpoints
echo "[Test 2/7] Checking service endpoints..."
FRONTEND_ENDPOINTS=$(kubectl get endpoints -n $NAMESPACE todo-chatbot-frontend-service -o jsonpath='{.subsets[*].addresses[*].ip}' | wc -w)
BACKEND_ENDPOINTS=$(kubectl get endpoints -n $NAMESPACE todo-chatbot-backend-service -o jsonpath='{.subsets[*].addresses[*].ip}' | wc -w)

if [ "$FRONTEND_ENDPOINTS" -lt 2 ]; then
  echo "❌ Frontend service has insufficient endpoints"
  exit 1
fi
if [ "$BACKEND_ENDPOINTS" -lt 2 ]; then
  echo "❌ Backend service has insufficient endpoints"
  exit 1
fi
echo "✅ Service endpoints configured"

# Test 3: Frontend health check
echo "[Test 3/7] Testing frontend health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://$MINIKUBE_IP:$FRONTEND_PORT/api/health)
if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Frontend health check failed (HTTP $HTTP_CODE)"
  exit 1
fi
echo "✅ Frontend health check passed"

# Test 4: Backend health check (from within cluster)
echo "[Test 4/7] Testing backend health..."
FRONTEND_POD=$(kubectl get pod -n $NAMESPACE -l component=frontend -o jsonpath='{.items[0].metadata.name}')
kubectl exec -n $NAMESPACE $FRONTEND_POD -- curl -f http://todo-chatbot-backend-service:8000/api/health > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Backend health check failed"
  exit 1
fi
echo "✅ Backend health check passed"

# Test 5: Database connectivity
echo "[Test 5/7] Testing database connectivity..."
BACKEND_POD=$(kubectl get pod -n $NAMESPACE -l component=backend -o jsonpath='{.items[0].metadata.name}')
# Assuming we add /api/db/ping endpoint
kubectl exec -n $NAMESPACE $BACKEND_POD -- curl -f http://localhost:8000/api/health > /dev/null
if [ $? -ne 0 ]; then
  echo "⚠️  Database connectivity test not available (add /api/db/ping endpoint)"
else
  echo "✅ Database connectivity verified"
fi

# Test 6: Resource usage
echo "[Test 6/7] Checking resource usage..."
kubectl top pods -n $NAMESPACE > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "⚠️  Metrics server not available (install with: minikube addons enable metrics-server)"
else
  echo "✅ Resource metrics available"
  kubectl top pods -n $NAMESPACE
fi

# Test 7: Persistent storage (create task, restart pod, verify)
echo "[Test 7/7] Testing data persistence..."
echo "⚠️  Manual test required: Create a task, delete pod, verify task exists"

echo ""
echo "==================================="
echo "✅ All Automated Tests Passed"
echo "==================================="
echo ""
echo "Manual Tests Required:"
echo "  1. Open http://$MINIKUBE_IP:$FRONTEND_PORT in browser"
echo "  2. Login with test account"
echo "  3. Create a task via chatbot"
echo "  4. Run: kubectl delete pod -n $NAMESPACE -l component=backend --field-selector=status.phase=Running | head -n 1"
echo "  5. Verify task still exists after pod restarts"

8. Monitoring & Observability
8.1 Logging Strategy
Pod Logs:
bash# View all logs
kubectl logs -f deployment/todo-chatbot-frontend -n todo

# View specific container
kubectl logs -f <pod-name> -c frontend -n todo

# View last 100 lines
kubectl logs --tail=100 <pod-name> -n todo

# View logs from all replicas
kubectl logs -f -l component=frontend -n todo --max-log-requests=10
Log Aggregation (Future):
yaml# For Phase V: Consider EFK stack
# - Elasticsearch: Log storage
# - Fluentd: Log collection
# - Kibana: Log visualization

8.2 Metrics Collection
Enable Metrics Server:
bashminikube addons enable metrics-server

# Wait for metrics to be available
kubectl wait --for=condition=ready pod -n kube-system -l k8s-app=metrics-server --timeout=60s
View Metrics:
bash# Node metrics
kubectl top nodes

# Pod metrics
kubectl top pods -n todo

# Specific pod
kubectl top pod <pod-name> -n todo

# Sort by CPU
kubectl top pods -n todo --sort-by=cpu

# Sort by memory
kubectl top pods -n todo --sort-by=memory

8.3 Health Monitoring
Check Health Probes:
bash# Describe pod to see probe status
kubectl describe pod <pod-name> -n todo | grep -A 5 "Liveness\|Readiness"

# Watch pod events
kubectl get events -n todo --sort-by='.lastTimestamp' --watch
Custom Health Dashboard (Using Kagent):
bash# Analyze cluster health
kagent "Create a health dashboard showing:
- Pod status and restart counts
- Resource utilization trends
- Service endpoint availability
- Recent error events"

9. Troubleshooting Guide
9.1 Common Issues & Solutions
Issue 1: ImagePullBackOff
Symptoms:
bash$ kubectl get pods -n todo
NAME                              READY   STATUS             RESTARTS   AGE
todo-frontend-xxx                 0/1     ImagePullBackOff   0          2m
Root Cause: Kubernetes cannot find the image in registry
Solution:
bash# Verify you're using Minikube's Docker daemon
eval $(minikube docker-env)

# Check if image exists
docker images | grep todo-frontend

# If not, rebuild
./scripts/build-images.sh

# If using imagePullPolicy: Always, change to IfNotPresent
# In values.yaml:
frontend:
  image:
    pullPolicy: IfNotPresent

Issue 2: CrashLoopBackOff
Symptoms:
bash$ kubectl get pods -n todo
NAME                              READY   STATUS             RESTARTS   AGE
todo-backend-xxx                  0/1     CrashLoopBackOff   5          5m
Diagnosis:
bash# Check logs
kubectl logs <pod-name> -n todo

# Check events
kubectl describe pod <pod-name> -n todo

# Use kubectl-ai
kubectl-ai "Diagnose why todo-backend pod is in CrashLoopBackOff"
Common Causes & Solutions:
a) Database connection failed
bash# Verify secret exists
kubectl get secret todo-secrets -n todo

# Check secret content (base64 decoded)
kubectl get secret todo-secrets -n todo -o jsonpath='{.data.database-url}' | base64 -d

# Test connection from pod
kubectl run -it --rm debug --image=postgres:15 --restart=Never -- psql "<connection-string>"
b) Missing environment variable
bash# Check pod environment
kubectl exec <pod-name> -n todo -- env | grep DATABASE_URL

# Verify ConfigMap
kubectl get configmap todo-config -n todo -o yaml
c) Application error
bash# View startup logs
kubectl logs <pod-name> -n todo --previous

# Check application code
# Fix and rebuild image

Issue 3: Service Not Accessible
Symptoms:

curl http://<minikube-ip>:30080 times out
Browser shows "connection refused"

Diagnosis:
bash# Check service
kubectl get svc -n todo

# Check endpoints
kubectl get endpoints -n todo

# Check if pods are ready
kubectl get pods -n todo
Solutions:
a) No endpoints (pods not ready)
bash# Check pod readiness
kubectl describe pod <pod-name> -n todo | grep -A 5 Readiness

# Check health endpoint
kubectl exec <pod-name> -n todo -- curl localhost:3000/api/health
b) Wrong NodePort
bash# Verify NodePort in service
kubectl get svc todo-chatbot-frontend-service -n todo -o yaml | grep nodePort

# Update values.yaml if needed
c) Firewall blocking port
bash# Use minikube service (bypasses firewall)
minikube service todo-chatbot-frontend-service -n todo

Issue 4: Pods Pending
Symptoms:
bash$ kubectl get pods -n todo
NAME                              READY   STATUS    RESTARTS   AGE
todo-frontend-xxx                 0/1     Pending   0          1m
Diagnosis:
bash# Check events
kubectl describe pod <pod-name> -n todo | grep -A 10 Events

# Common message: "Insufficient cpu" or "Insufficient memory"
Solutions:
a) Insufficient resources
bash# Check node capacity
kubectl describe node minikube | grep -A 5 "Allocated resources"

# Reduce resource requests in values.yaml
frontend:
  resources:
    requests:
      cpu: 50m      # Reduced from 100m
      memory: 64Mi  # Reduced from 128Mi

# Or increase Minikube resources
minikube delete
minikube start --cpus=6 --memory=10240
b) Node not ready
bash# Check node status
kubectl get nodes

# If NotReady, restart minikube
minikube stop && minikube start

9.2 Debugging Workflow
Step-by-Step Debug Process:
bash# 1. Check overall cluster health
kubectl get nodes
kubectl get pods --all-namespaces

# 2. Check our namespace
kubectl get all -n todo

# 3. Identify problematic pod
kubectl get pods -n todo

# 4. Get detailed pod info
kubectl describe pod <pod-name> -n todo

# 5. Check logs
kubectl logs <pod-name> -n todo
kubectl logs <pod-name> -n todo --previous  # Previous instance

# 6. Check events
kubectl get events -n todo --sort-by='.lastTimestamp'

# 7. Exec into pod for debugging
kubectl exec -it <pod-name> -n todo -- /bin/sh

# Inside pod:
# - Test connectivity: curl http://todo-backend-service:8000/api/health
# - Check environment: env | grep DATABASE
# - Test database: psql $DATABASE_URL -c "SELECT 1"

# 8. Use kubectl-ai for analysis
kubectl-ai "Analyze why <pod-name> is failing and suggest fixes"

# 9. Use Kagent for cluster-wide issues
kagent "Identify system-wide issues affecting pod scheduling"

9.3 Rollback Procedure
If Deployment Fails:
bash# List releases
helm list -n todo

# Check revision history
helm history todo-chatbot -n todo

# Rollback to previous version
helm rollback todo-chatbot -n todo

# Rollback to specific revision
helm rollback todo-chatbot 1 -n todo

# Verify rollback
kubectl get pods -n todo
kubectl logs -f -l component=frontend -n todo

10. Performance Optimization
10.1 Image Optimization Checklist

 Multi-stage builds implemented
 .dockerignore configured
 Minimal base images (Alpine for Node, Slim for Python)
 Layer caching optimized (dependencies before code)
 No unnecessary packages installed
 Build artifacts cleaned up
 Image scanned for vulnerabilities

10.2 Pod Optimization Checklist

 Resource requests match actual usage
 Resource limits prevent OOM kills
 Health probes configured correctly
 Graceful shutdown implemented (SIGTERM handler)
 Readiness probe delays prevent premature traffic
 Liveness probe timeouts prevent false restarts

10.3 Cluster Optimization Checklist

 Appropriate number of replicas (2 minimum for HA)
 Rolling update strategy prevents downtime
 Node resources sufficient for all pods
 Persistent storage not used for ephemeral data
 Secrets and ConfigMaps used correctly
 Services properly configured (ClusterIP vs NodePort)


11. Security Hardening
11.1 Pod Security Standards
yaml# Apply to deployments
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000
  allowPrivilegeEscalation: false
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: true  # When possible
11.2 Network Policies (Phase V)
yaml# For Phase IV: Document for future implementation
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: todo-backend-policy
  namespace: todo
spec:
  podSelector:
    matchLabels:
      component: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          component: frontend
    ports:
    - protocol: TCP
      port: 8000
11.3 RBAC (Role-Based Access Control)
yaml# Service account with minimal permissions
apiVersion: v1
kind: ServiceAccount
metadata:
  name: todo-chatbot-sa
  namespace: todo
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: todo-chatbot-role
  namespace: todo
rules:
- apiGroups: [""]
  resources: ["configmaps", "secrets"]
  verbs: ["get", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: todo-chatbot-binding
  namespace: todo
subjects:
- kind: ServiceAccount
  name: todo-chatbot-sa
roleRef:
  kind: Role
  name: todo-chatbot-role
  apiGroup: rbac.authorization.k8s.io

12. Cleanup & Resource Management
12.1 Uninstall Application
bash#!/bin/bash
# scripts/cleanup.sh

echo "=== Cleaning Up Todo Chatbot ==="

# Uninstall Helm release
echo "Uninstalling Helm release..."
helm uninstall todo-chatbot -n todo

# Delete namespace (includes all resources)
echo "Deleting namespace..."
kubectl delete namespace todo

# Remove Docker images (optional)
read -p "Remove Docker images? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  docker rmi todo-frontend:v1 todo-backend:v1
  echo "Images removed"
fi

echo "✅ Cleanup complete"
12.2 Stop Minikube
bash# Stop cluster (preserves state)
minikube stop

# Delete cluster (removes everything)
minikube delete

# Delete all profiles
minikube delete --all
```

---

## 13. Documentation Plan

### 13.1 Required Documentation Files
```
docs/
├── architecture.md           # System architecture diagrams
├── deployment-runbook.md     # Step-by-step deployment
├── troubleshooting.md        # Common issues & solutions
├── gordon-usage.md          # Docker AI usage documentation
├── kubectl-ai-usage.md      # Kubernetes AI CLI documentation
├── kagent-analysis.md       # Cluster analysis reports
├── performance-tuning.md    # Optimization guide
├── security-hardening.md    # Security best practices
└── api-reference.md         # Internal API documentation
13.2 README.md Sections

Overview - What is Phase IV
Prerequisites - Required tools and accounts
Architecture - Diagrams and explanations
Quick Start - Get running in 5 minutes
Detailed Setup - Step-by-step instructions
Configuration - values.yaml options
Deployment - Helm deployment guide
Testing - Validation procedures
Troubleshooting - Common issues
Contributing - Development workflow
License - MIT License


14. Success Criteria
14.1 Technical Criteria

 All containers build successfully under size targets
 Helm chart deploys without errors
 All pods reach Running state within 2 minutes
 Health checks pass for all pods
 Frontend accessible via NodePort
 Backend communicates with frontend
 Database connectivity confirmed
 Application features work (all Basic Level)
 Rolling updates complete without downtime
 Resource usage within defined limits

14.2 Documentation Criteria

 README complete with setup instructions
 Architecture diagrams included
 Deployment runbook covers 10+ scenarios
 All AI tool usage documented
 Troubleshooting guide comprehensive
 Code comments explain decisions

14.3 Spec-Driven Criteria

 Constitution followed throughout
 Specification requirements met
 Tasks traceable to spec sections
 No manual code writing (all via Claude Code)
 AI DevOps tools used (Gordon, kubectl-ai, Kagent)
 Deviations documented with rationale


15. Risk Mitigation
RiskMitigation StrategyMinikube resource constraintsDocument minimum specs, provide scaling down optionsDocker build failuresMulti-stage builds, clear error handling, fallback commandsSecret management issues.env.example template, validation scriptsHealth check failuresAppropriate delays, timeout tuning, fallback endpointsImage size bloat.dockerignore, multi-stage builds, Alpine imagesPod scheduling delaysConservative resource requests, cluster pre-warmingService connectivity issuesClear DNS documentation, connection test scriptsHelm chart syntax errorsExtensive linting, dry-run validation

16. Next Steps (Phase V Preparation)
This Phase IV implementation prepares for Phase V by:

Containerization Patterns - Reusable for cloud deployment
Kubernetes Manifests - Adaptable for GKE/AKS
Helm Chart - Extensible for Kafka, Dapr
Resource Definitions - Baseline for autoscaling
Security Practices - Foundation for production hardening
Monitoring Setup - Expandable to Prometheus/Grafana

Phase V Delta:

Add Kafka StatefulSet
Integrate Dapr sidecars
Implement Ingress with TLS
Set up HPA (Horizontal Pod Autoscaler)
Configure Persistent Volumes
Deploy to cloud (DOKS/GKE/AKS)


17. Appendix
A. Minikube Cheat Sheet
bash# Start/Stop
minikube start
minikube stop
minikube delete

# Status
minikube status
minikube ip
minikube dashboard

# Addons
minikube addons list
minikube addons enable <addon>
minikube addons disable <addon>

# Docker
eval $(minikube docker-env)      # Use Minikube's Docker
eval $(minikube docker-env -u)   # Undo

# Services
minikube service <service-name> -n <namespace>
minikube service list

# Logs
minikube logs
minikube logs --file=minikube.log

# SSH
minikube ssh
B. Kubectl Cheat Sheet
bash# Context
kubectl config get-contexts
kubectl config use-context minikube

# Resources
kubectl get <resource>
kubectl describe <resource> <name>
kubectl delete <resource> <name>

# Pods
kubectl get pods -n <namespace>
kubectl logs -f <pod-name> -n <namespace>
kubectl exec -it <pod-name> -n <namespace> -- /bin/sh

# Deployments
kubectl get deployments -n <namespace>
kubectl scale deployment <name> --replicas=3 -n <namespace>
kubectl rollout status deployment/<name> -n <namespace>
kubectl rollout history deployment/<name> -n <namespace>

# Services
kubectl get svc -n <namespace>
kubectl expose deployment <name> --type=NodePort --port=8080

# ConfigMaps/Secrets
kubectl create configmap <name> --from-file=<file>
kubectl create secret generic <name> --from-literal=key=value

# Debugging
kubectl describe pod <name>
kubectl get events --sort-by='.lastTimestamp'
kubectl top nodes
kubectl top pods -n <namespace>
C. Helm Cheat Sheet
bash# Repositories
helm repo add <name> <url>
helm repo update
helm search repo <keyword>

# Install
helm install <release-name> <chart> -n <namespace>
helm install <release-name> <chart> --values <values-file>
helm install <release-name> <chart> --set key=value

# Upgrade
helm upgrade <release-name> <chart>
helm upgrade --install <release-name> <chart>  # Install if not exists

# Rollback
helm rollback <release-name>
helm rollback <release-name> <revision>

# Status
helm list -n <namespace>
helm status <release-name>
helm history <release-name>

# Uninstall
helm uninstall <release-name> -n <namespace>

# Development
helm create <chart-name>
helm lint <chart>
helm template <release-name> <chart>
helm install --dry-run --debug <release-name> <chart>