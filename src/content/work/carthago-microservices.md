---
title: "CARTHAGO → microservices, at a national bank"
kicker: "Banking modernization · 2024 → present"
role: "Lead Developer & Enterprise Architect"
client: "Crédit Foncier du Cameroun (national housing bank)"
period: "2024 — present"
summary: "Migrating a national core banking platform from legacy CARTHAGO to a distributed microservices architecture. Real-time CDC integration, parallel-run topology, COBAC regulatory compliance — across ten branches and the headquarters."
excerpt: "The migration of a forty-year-old core banking system to a distributed microservices architecture. Real-time CDC pipelines for the parallel-run integration; onboarding, deposits, loans, payments and regulatory reporting under COBAC. The substrate AI deployments will sit on top of."
tags: ["banking", "microservices", "Kafka", "CDC", "architecture"]
order: 10
featured: true
---

## The brief

Crédit Foncier du Cameroun is a national institution. Every working day, transactions flow through a core banking platform that has been running, in some form, for several decades. The system works. It is also a constraint on every modernization the bank has tried to attempt — it is not API-first, it does not expose real-time events, and it was not designed for the resilience and observability standards modern regulation now expects.

I was brought in to lead the architectural side of the bank's digital transformation: design and execute the migration of the legacy CARTHAGO core banking platform to a distributed microservices architecture, end to end. The work covers customer onboarding, deposits, loans, payments, and regulatory reporting, across ten branches and the headquarters, under the supervision of the Commission Bancaire de l'Afrique Centrale (COBAC).

## What made it hard

Three constraints, in the order they bit:

**You cannot turn the bank off.** A core banking system is not a typical IT system you can replace overnight. Every customer's account, every loan repayment schedule, every regulatory report depends on continuous availability. The migration had to happen with both systems running side by side for as long as it took, with zero data loss between them.

**The regulatory floor is non-negotiable.** COBAC reporting, KYC/AML processes, audit trails — these have to keep working through the entire migration. "We are modernizing" is not an acceptable explanation for a missed regulatory submission.

**The IT organization had to evolve in parallel.** Microservices, CI/CD, observability, container orchestration — these were not part of the daily practice of the team before this program started. Shipping a clean platform that nobody knows how to operate is worse than shipping nothing.

## Approach

A *strangler-fig* migration, structured in three phases.

**Phase 1 — Foundation.** Stand up the integration substrate before touching any banking logic. We deployed a real-time data fabric: Apache Kafka with Debezium for change-data-capture from CARTHAGO, landing into Cassandra and PostgreSQL on the modern side. This gave us a live, low-latency mirror of the legacy state — the prerequisite for any safe parallel run. In parallel: container platform (Docker, Kubernetes), CI/CD (Jenkins, GitLab CI), and observability (Prometheus, Grafana, Alertmanager).

**Phase 2 — Domain by domain.** Pick one banking process, build the modern microservice, run it alongside the legacy implementation, prove parity, then route new traffic to the modern path. Customer onboarding came first — lowest risk, highest learning leverage. Each subsequent domain (deposits, loans, payments) built on the integration patterns and the team practices that the previous one established.

**Phase 3 — Inversion.** As each domain reaches full parity, the CDC flow inverts: the modern microservice becomes the source of truth and the legacy system becomes a downstream consumer until it can be retired. This is the part that turns a parallel run into an actual migration.

Across all phases, every architectural decision lived in an Architecture Decision Record reviewed by the executive committee. API contracts (REST and SOAP) and a schema registry (Avro) gave us domain-stable interfaces that internal channels and external partners could rely on without re-syncing every time we changed something.

## What it produced

A real-time, event-driven integration layer between legacy and modern core banking systems — running in production, zero data loss, used as the basis for all subsequent domain migrations. A microservices platform with CI/CD and full observability now standard practice across the IT organization. Architecture decision records, security and data governance frameworks, COBAC-compliant audit trails. An operational helpdesk platform that reduced IT interventions by roughly 30%, freeing capacity across the network.

More than the artifacts, the lasting change is in how the IT team works. Releases are no longer all-or-nothing events; deployment is no longer the riskiest day of the month. That cultural shift is the precondition for everything we want to do next — including the AI workloads that will increasingly run on top of this fabric.

## Reflection

The instinct that carries through every part of this work is the same one I now apply to AI architecture: build the system to fail safely. CDC parallel-run is what lets the modernization fail safely. Strict source-grounding and forced citations are what let RAG fail safely. In both cases, we are putting guardrails around something powerful and imperfect so the system as a whole can be trusted.

If I were starting again, I would invest in the automated reconciliation harness for CDC consistency on day one. We caught divergence events through user reports for too long before we built the checks; the lesson — *evaluation is not a phase, it is a discipline* — is the one I now carry into AI work too.
