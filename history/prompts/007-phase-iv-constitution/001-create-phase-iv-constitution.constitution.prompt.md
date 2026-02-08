---
id: "001"
title: "Create Phase IV Constitution"
stage: "constitution"
date: "2026-02-08"
surface: "agent"
model: "gemini"
feature: "none"
branch: "main"
user: "user"
command: "/sp.constitution Constitution: Phase IV - Local Kubernetes Deployment"
labels: ["constitution", "phase4", "kubernetes"]
links:
  spec: "null"
  ticket: "null"
  adr: "null"
  pr: "null"
files_yaml:
  - .specify/memory/constitution-phase4.md
tests_yaml:
  - "N/A"
prompt_text: |-
  /sp.constitution Constitution: Phase IV - Local Kubernetes Deployment
  Project Identity
  Project Name: Todo Chatbot - Cloud Native Deployment (Phase IV)
  Version: 1.0.0
  Phase: IV of V (Evolution of Todo)
  Objective: Deploy AI-powered Todo Chatbot on local Kubernetes infrastructure using cloud-native patterns and AIOps tools

  1. Core Principles
  1.1 Development Philosophy

  Spec-Driven Development (SDD): ALL implementation MUST follow the Specify → Plan → Tasks → Implement cycle
  AI-First DevOps: Leverage Gordon, kubectl-ai, and Kagent for infrastructure operations; manual commands are fallback only
  No Manual Coding: Code generation MUST be done via Claude Code interpreting specifications
  Cloud-Native Patterns: Follow 12-factor app principles, containerization best practices, and Kubernetes conventions
  Infrastructure as Code: All deployment configurations MUST be version-controlled and reproducible

  1.2 Quality Standards

  Reproducibility: Any developer should be able to deploy from scratch using only repository contents
  Idempotency: Deployment scripts and Helm charts MUST be safe to run multiple times
  Security First: No secrets in code, proper RBAC, network policies enforced
  Documentation: Every configuration change MUST be documented in specs with rationale


  2. Technology Stack (Non-Negotiable)
  2.1 Core Infrastructure
  yamlContainer Runtime: Docker Desktop (latest stable)
  Container Orchestration: Kubernetes via Minikube (v1.32+)
  Package Manager: Helm 3.x
  Base Application: Phase III Todo Chatbot (Next.js + FastAPI + MCP)
  2.2 AIOps Tools (Required)
  yamlDocker AI Agent: Gordon (Docker Desktop 4.53+)
  Kubernetes AI CLI: kubectl-ai
  Kubernetes Agent: Kagent
  Development AI: Claude Code with Spec-Kit Plus
  2.3 Application Components to Containerize

  Frontend: Next.js application with Better Auth
  Backend: FastAPI with MCP Server, OpenAI Agents SDK
  Database: Neon Serverless PostgreSQL (external, connection only)


  3. Architecture Constraints
  3.1 Container Design Principles

  Single Responsibility: One process per container (frontend, backend separate)
  Statelessness: Application containers MUST NOT store persistent data locally
  Health Checks: Every container MUST expose /health endpoint
  Graceful Shutdown: Containers MUST handle SIGTERM properly
  Multi-Stage Builds: Dockerfiles MUST use multi-stage builds for optimal image size

  3.2 Kubernetes Resource Standards
  yamlDeployments:
    - Minimum 2 replicas for high availability simulation
    - Resource requests and limits MUST be defined
    - Rolling update strategy required
    - Liveness and readiness probes mandatory

  Services:
    - ClusterIP for internal services
    - NodePort or LoadBalancer for external access
    - Service naming: <component>-service

  ConfigMaps/Secrets:
    - Environment-specific configs in ConfigMaps
    - Sensitive data (API keys, DB credentials) in Secrets
    - NO hardcoded values in deployment YAMLs
  3.3 Helm Chart Structure
  ```
  todo-chatbot-chart/
  ├── Chart.yaml          # Metadata
  ├── values.yaml         # Default configuration
  ├── templates/
  │   ├── frontend-deployment.yaml
  │   ├── frontend-service.yaml
  │   ├── backend-deployment.yaml
  │   ├── backend-service.yaml
  │   ├── configmap.yaml
  │   ├── secrets.yaml
  │   └── ingress.yaml
  └── README.md
  ```

  4. Development Workflow (Mandatory Process)

  4.1 Spec-Kit Integration
  Every infrastructure change follows this cycle:
  ```
  1. SPECIFY (specs/phase4/containerization.md)
     - What needs to be containerized
     - What Kubernetes resources are required
     - What Helm values need to be configurable

  2. PLAN (speckit.plan)
     - Dockerfile strategies for frontend/backend
     - Kubernetes manifest architecture
     - Helm chart organization
     - Service mesh topology

  3. TASKS (speckit.tasks)
     - T-001: Create multi-stage Dockerfile for Next.js frontend
     - T-002: Create Dockerfile for FastAPI backend
     - T-003: Generate Helm chart scaffolding
     - T-004: Define Kubernetes deployments with kubectl-ai
     - T-005: Configure services and ingress
     - T-006: Set up secrets management
     - T-007: Deploy to Minikube and validate

  4. IMPLEMENT
     - Claude Code executes tasks using Gordon/kubectl-ai/Kagent
     - Validate against acceptance criteria
     - Document deviations in specs/history/
  4.2 Gordon (Docker AI) Usage Pattern
  bash# Preferred: AI-assisted Docker operations
  docker ai "create optimized multi-stage Dockerfile for Next.js 16 with app router"
  docker ai "build and tag the frontend image with proper caching"
  docker ai "analyze this image for security vulnerabilities"

  # Fallback: Manual commands only if Gordon unavailable
  docker build -t todo-frontend:v1 ./frontend
  4.3 kubectl-ai Usage Pattern
  bash# Preferred: AI-assisted Kubernetes operations
  kubectl-ai "deploy the todo frontend with 2 replicas and 500m CPU limit"
  kubectl-ai "create a ClusterIP service for the backend on port 8000"
  kubectl-ai "check why the frontend pods are in CrashLoopBackOff"
  kubectl-ai "scale the backend to handle more load"

  # Fallback: Manual kubectl only if kubectl-ai unavailable
  kubectl apply -f k8s/frontend-deployment.yaml
  4.4 Kagent Usage Pattern
  bash# Advanced cluster analysis and optimization
  kagent "analyze the cluster health and resource utilization"
  kagent "optimize resource allocation for cost efficiency"
  kagent "suggest improvements to our deployment strategy"

  5. Security Requirements
  5.1 Secret Management
  yamlProhibited:
    - API keys in Dockerfiles or code
    - Database credentials in values.yaml
    - Hardcoded URLs or tokens

  Required:
    - Kubernetes Secrets for sensitive data
    - Environment variable injection at runtime
    - .env files for local development (git-ignored)
    - Separate secrets per environment
  5.2 Image Security

  Base Images: Use official, minimal base images (node:alpine, python:3.13-slim)
  Vulnerability Scanning: Scan all images with docker ai "scan this image for vulnerabilities"
  Non-Root User: Containers MUST NOT run as root
  Read-Only Root Filesystem: Where possible, use read-only root filesystems

  5.3 Network Security

  Network Policies: Define allowed ingress/egress paths
  Service Isolation: Backend should not be directly accessible from outside cluster
  TLS/HTTPS: Enable for external-facing services (ingress)


  6. Resource Management
  6.1 Resource Quotas (Per Pod)
  yamlfrontend:
    requests:
      cpu: 100m
      memory: 128Mi
    limits:
      cpu: 500m
      memory: 512Mi

  backend:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  6.2 Minikube Cluster Specifications
  bash# Minimum cluster configuration
  minikube start
    --cpus=4
    --memory=8192
    --disk-size=20g
    --driver=docker
    --kubernetes-version=v1.28.0

  7. Testing & Validation Standards
  7.1 Container Testing

  Build Validation: All images MUST build without errors
  Runtime Testing: Containers MUST start and respond to health checks
  Integration Testing: Frontend MUST successfully communicate with Backend
  Performance: Application should respond within 2s under local load

  7.2 Kubernetes Validation
  bash# All pods MUST reach Running state within 2 minutes
  kubectl get pods --all-namespaces

  # All services MUST have endpoints
  kubectl get endpoints

  # Health checks MUST pass
  kubectl describe pods | grep -A 5 "Liveness\|Readiness"
  7.3 Helm Chart Validation
  bash# Lint charts before deployment
  helm lint ./todo-chatbot-chart

  # Dry-run to catch template errors
  helm install --dry-run --debug todo-chatbot ./todo-chatbot-chart

  # Template rendering validation
  helm template todo-chatbot ./todo-chatbot-chart | kubectl apply --dry-run=client -f -
  8. Documentation Requirements

  8.1 Required Documentation Files
  ```
  /specs/phase4/
  ├── containerization-strategy.md    # Dockerfile decisions
  ├── kubernetes-architecture.md      # K8s resource design
  ├── helm-configuration.md          # Chart values and customization
  ├── deployment-runbook.md          # Step-by-step deployment guide
  └── troubleshooting.md             # Common issues and solutions

  /
  ├── CLAUDE.md                      # Claude Code instructions
  ├── README.md                      # Setup and running instructions
  └── CONTRIBUTING.md                # Development workflow
  ```

  8.2 Documentation Standards
  - **Diagrams Required:** Include Kubernetes architecture diagrams (use Mermaid or ASCII art)
  - **Command Examples:** Every CLI command MUST include example output
  - **Troubleshooting:** Document every error encountered during development
  - **Rationale:** Explain WHY decisions were made, not just WHAT was done

  9. Deliverables Checklist

  9.1 Repository Structure
  ```
  hackathon-todo-phase4/
  ├── .spec-kit/
  │   └── config.yaml
  ├── specs/
  │   ├── phase4/
  │   │   ├── containerization-strategy.md
  │   │   ├── kubernetes-architecture.md
  │   │   └── helm-configuration.md
  │   └── history/
  ├── frontend/
  │   ├── Dockerfile
  │   ├── .dockerignore
  │   └── (Next.js app from Phase III)
  ├── backend/
  │   ├── Dockerfile
  │   ├── .dockerignore
  │   └── (FastAPI app from Phase III)
  ├── helm-charts/
  │   └── todo-chatbot/
  │       ├── Chart.yaml
  │       ├── values.yaml
  │       └── templates/
  ├── k8s/                           # Raw manifests (if not using Helm)
  │   ├── frontend-deployment.yaml
  │   ├── backend-deployment.yaml
  │   └── ...
  ├── scripts/
  │   ├── deploy-minikube.sh
  │   ├── cleanup.sh
  │   └── test-deployment.sh
  ├── CLAUDE.md
  ├── AGENTS.md
  └── README.md
  9.2 Functional Requirements

  ✅ Todo Chatbot from Phase III fully operational in Kubernetes
  ✅ Frontend accessible via Minikube IP or ingress
  ✅ Backend MCP server responding to agent requests
  ✅ Database connection to Neon working from pods
  ✅ Better Auth authentication functioning in containerized environment
  ✅ All Basic Level features (Add, Delete, Update, View, Mark Complete) working

  9.3 Infrastructure Requirements

  ✅ Dockerfiles using multi-stage builds
  ✅ Kubernetes deployments with health checks
  ✅ Helm chart with configurable values
  ✅ Secrets properly managed (not in code)
  ✅ Services configured for inter-pod communication
  ✅ Ingress or NodePort for external access

  9.4 AI DevOps Requirements

  ✅ Evidence of Gordon usage in Docker operations (screenshots/logs)
  ✅ Evidence of kubectl-ai usage in K8s operations
  ✅ Evidence of Kagent usage for cluster analysis
  ✅ All commands documented in deployment runbook


  10. Constraints & Limitations
  10.1 What You CANNOT Do

  ❌ Write Dockerfiles or Kubernetes manifests manually (use Claude Code)
  ❌ Skip the Spec-Kit workflow (Specify → Plan → Tasks → Implement)
  ❌ Hardcode secrets or credentials
  ❌ Deploy without testing locally first
  ❌ Use outdated or unsupported Kubernetes API versions
  ❌ Ignore resource limits (causes cluster instability)

  10.2 What You MUST Do

  ✅ Use Claude Code + Spec-Kit Plus for ALL implementation
  ✅ Leverage Gordon, kubectl-ai, Kagent (or document why not available)
  ✅ Test every component in isolation before integration
  ✅ Document every deviation from the original plan
  ✅ Keep specs updated as architecture evolves
  ✅ Provide clear README with setup instructions


  11. Acceptance Criteria
  11.1 Deployment Success Criteria
  A Phase IV submission is considered complete when:

  Containerization:

  Frontend and Backend Docker images build successfully
  Images are optimized (< 500MB for Next.js, < 300MB for FastAPI)
  Images run locally with docker run before Kubernetes deployment


  Kubernetes Deployment:

  kubectl get pods shows all pods in Running state
  kubectl get services shows all services with endpoints
  kubectl logs <pod> shows no critical errors
  Health checks (liveness/readiness) passing for all pods


  Application Functionality:

  Todo Chatbot UI accessible via browser
  Natural language commands working ("Add a task to buy groceries")
  MCP tools (add_task, list_tasks, etc.) functioning
  Authentication (Better Auth) working in containerized environment
  Database persistence confirmed (create task, restart pod, task still exists)


  Helm Chart Quality:

  helm lint passes with no errors
  helm install succeeds on fresh Minikube cluster
  helm upgrade works without downtime
  Values.yaml has clear comments and sensible defaults


  Documentation:

  README includes step-by-step deployment instructions
  Architecture diagrams included
  Troubleshooting section covers common issues
  All specs files updated and consistent



  11.2 Demo Video Requirements (90 seconds max)
  Must show:

  Starting Minikube cluster
  Deploying with Helm (or kubectl-ai)
  Accessing Todo Chatbot in browser
  Adding a task via natural language
  Checking pod status with kubectl
  (Bonus) Using Gordon/kubectl-ai/Kagent


  12. Bonus Points Opportunities
  12.1 Reusable Intelligence (+200 points)

  Create Claude Code Subagent for Kubernetes deployments
  Develop Agent Skill for Helm chart generation
  Document reusable patterns in /skills folder

  12.2 Cloud-Native Blueprints (+200 points)

  Create deployment blueprint via Agent Skills
  Automate entire Phase IV deployment with single Claude Code prompt
  Publish blueprint for community reuse


  13. Version Control & Collaboration
  13.1 Git Workflow
  bash# Branch strategy
  main                    # Stable, working Phase IV deployment
  ├── feature/docker      # Containerization work
  ├── feature/k8s         # Kubernetes manifests
  └── feature/helm        # Helm chart development

  # Commit message format
  feat(docker): add multi-stage Dockerfile for frontend
  fix(k8s): correct backend service port mapping
  docs(specs): update kubernetes architecture diagram
  13.2 Required Git Files
  ```
  .gitignore              # Secrets, build artifacts, .env files
  .dockerignore           # Node_modules, .git, etc.

  14. Success Metrics
  This Phase IV implementation will be evaluated on:
  CriteriaWeightDescriptionSpec-Driven Compliance25%Evidence of Specify → Plan → Tasks → Implement cycleContainer Quality20%Dockerfile optimization, security, multi-stage buildsKubernetes Architecture25%Proper resource definitions, health checks, servicesHelm Chart Usability15%Clean templates, configurable values, documentationAIOps Tool Usage10%Effective use of Gordon, kubectl-ai, KagentDocumentation5%README, diagrams, troubleshooting guide
  Minimum Passing Score: 70/100

  15. Final Notes
  15.1 Philosophy
  Phase IV is about operational excellence and cloud-native thinking. The goal is not just to "get it running in Kubernetes" but to demonstrate:

  Understanding of containerization best practices
  Kubernetes resource management
  Infrastructure as Code principles
  AI-assisted DevOps workflows

  15.2 When You're Stuck

  Check the specs first - The answer is usually in your specification files
  Ask kubectl-ai/Kagent - "check why pods are failing"
  Consult AGENTS.md - Ensure you're following the prescribed workflow
  Use Claude Code - Describe the problem, reference the spec, let it solve

  15.3 Remember

  "The best infrastructure is invisible to the developer but visible to the operator."

  Your Helm chart should make deployment effortless. Your documentation should make troubleshooting straightforward. Your specs should make the architecture understandable.

  Constitution Version: 1.0.0
  Last Updated: Phase IV Kickoff
  Next Review: Upon Phase V Transition
response_text: |-
  The Phase IV constitution has been created in a new file: `.specify/memory/constitution-phase4.md`.

  **Summary:**
  - A new constitution file for "Phase IV - Local Kubernetes Deployment" has been created at `.specify/memory/constitution-phase4.md`.
  - The previous constitution at `.specify/memory/constitution.md` remains unchanged.
  - **Action Required:** The `README.md` file is currently out of date and should be updated to reflect the new Phase IV context.
  - **Action Required:** You now have two constitution files. Please decide which constitution should be considered active, or if they need to be consolidated.
---
