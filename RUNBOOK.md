# Operations Runbook: oengo-web

## Incident Escalation Matrix
- **Level 1:** SRE On-Call (PagerDuty)
- **Level 2:** oengo-web Domain Lead
- **Level 3:** Enterprise Architecture & Security Board

## Quick Diagnostic Commands
\\\ash
# Check pod status
kubectl get pods -n oenexa-production -l app=oengo-web

# Stream recent logs
kubectl logs -n oenexa-production -l app=oengo-web --tail=100 -f

# Check recent Prometheus alerts
curl -s http://prometheus.oenexa.internal/api/v1/alerts
\\\
"@

Write-IfMissing "API.md" @"
# API Specification: oengo-web

> **Synchronous Protocol:** REST (OpenAPI 3.1) / gRPC (HTTP/2)  
> **Base Path:** \/v1\  
> **Auth:** Bearer JWT issued by \id.oenexa.com\ (RFC 9068)  

Detailed OpenAPI specifications are maintained in [\/api/v1/openapi.json\](file:///C:/workspace/oenexarepo/oengo-web/api/v1/openapi.json).