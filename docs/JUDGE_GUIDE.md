# Judge Guide

## Why n8n?

n8n is the control plane: it schedules NASA retrieval, validates and normalizes external data, coordinates deterministic scoring, routes risk levels, persists dashboard data, and provides execution visibility. It makes integrations and alert destinations configurable without rewriting the frontend.

## What if NASA fails?

The request uses bounded retries and a timeout. Validation prevents partial or malformed records from overwriting the published intelligence. An n8n error workflow should notify maintainers; the dashboard retains its last successful data and marks it stale after 26 hours.

## What if AI fails? Is AI creating the score?

There is no active AI claim in this build. The dashboard uses an **Automated Threat Assessment** generated from deterministic telemetry. If a credentialed LLM node is later added, it may only explain structured output. It cannot set the score or risk band, and its failure falls back to the deterministic assessment.

## Is this an official NASA risk score?

No. The Prototype NEO Threat Index is a transparent hackathon heuristic using hazardous flag, miss distance, diameter, and velocity.

## Are trajectories scientifically exact?

No. The Three.js paths are interpretive relative-flyby visualizations, not orbital propagation.

## Why GitHub storage?

It is a lightweight, public, auditable, zero-backend persistence/distribution layer for a prototype. Production should use a persistent database plus API/cache while retaining n8n as the orchestration core.

## Why simulation?

Dangerous NEO events cannot be expected on cue. Simulation safely demonstrates validation, classification, conditional routing, and the alert story without claiming synthetic data is NASA telemetry.
