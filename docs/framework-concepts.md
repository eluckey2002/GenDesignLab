# Emergence Design Framework — Core Concepts

> **Read this first.** This is the conceptual foundation every agent and contributor needs before working in this repo.

---

## What This Is

This is **not a generative art tool**.

It is a framework for building and porting **emergent design systems**.

The framework breaks complex visual systems into reusable parts: the thing that creates a pattern, the world that pattern lives in, the pressure acting on it, and the way we observe the result.

The goal:

> Build reusable system behaviors once, then port, recombine, and observe them across many different contexts.

---

## The Recipe

Every system in EDF can be expressed as one recipe:

> **Pattern-maker + World + Pressure + Readout = Observable emergent behavior**

| Friendly term     | Technical term                 | What it is |
| ----------------- | ------------------------------ | ---------- |
| **Pattern-maker** | Generator                      | Creates form, motion, growth, or structure |
| **World**         | Substrate                      | The space or surface the pattern lives on |
| **Pressure**      | Operation / Field / Constraint | The force that changes behavior: scarcity, attraction, selection, flow |
| **Readout**       | Diagnostics / Visualization    | How we observe what happened |
| **Outcome**       | Artifact / System behavior     | The visible result, discovery, or structure |

These five terms are the **canonical vocabulary**. Use them exactly. Do not substitute synonyms.

---

## Portability Is the Core Principle

A component is only a **framework component** — not a one-off creative output — when it has been demonstrated portable: run successfully in at least two distinct worlds with no or minimal modification.

**Portability is testable, not assumed.** Every study document records whether portability was tested and in which second world.

The flywheel:
1. Build a behavior
2. Prove it ports
3. Add it to the catalog
4. Recombine with other catalog entries
5. Observe what emerges
6. Repeat

---

## Why the Recipe Decomposition Matters

Even a small catalog creates a large possibility space:

> 4 pattern-makers × 4 worlds × 4 pressures × 4 readouts = **256 possible combinations**

More importantly, each combination can reveal a different behavior — one that no one specifically designed.

This is the shift from making artifacts to making **conditions for discovery**.

---

## What "Pressure" Means

A pressure is anything that changes what grows, survives, moves, fades, branches, or adapts.

| Friendly pressure            | Technical version        | What it reveals |
| ---------------------------- | ------------------------ | --------------- |
| **Energy / scarcity**        | Metabolism / EnergyField | What survives, starves, recovers, or collapses |
| **Attraction / repulsion**   | Force field              | What clusters, separates, or flows |
| **Inheritance / adaptation** | Lineage / selection      | What traits persist or diverge |
| **Flow / circulation**       | Vector field             | Where motion concentrates or bottlenecks |

Energy and metabolism are especially important — they make patterns behave like living systems rather than static drawings.

---

## What "World" Means

A world is the environment the pattern lives inside. The same pattern behaves differently in different worlds.

> Change the world, and the behavior changes — even if the pattern-maker stays the same.

Examples: flat surface, curved surface, dome, shell, terrain, city grid, building facade, textile, network.

---

## Example Recipe

| Step | Example |
| ---- | ------- |
| Pattern-maker | Branching growth |
| World | Curved architectural facade |
| Pressure | Sunlight / heat exposure |
| Readout | Density and survival map |
| Behavior observed | Pattern grows denser where shading is needed, opens where light is useful |
| Outcome | Adaptive facade concept |

---

## Recipe vs. ADR

**A recipe definition or modification is documented as a study** (`docs/studies/`), not as an ADR. The study captures the hypothesis before work begins and the findings after.

**If a study's findings produce changes to module structure, boundaries, or cross-module APIs** — that change may trigger an ADR. The study is what surfaces that decision; the ADR records it.

---

## The Scientific Stance

EDF treats every build as a controlled experiment:

- **Hypothesis first** — define what you expect before you write code
- **Atomic testing** — test phases in isolation so failures have clear causes
- **Cache markers** — small version tags in visual output prevent wrong-direction debugging
- **Findings documented** — post-mortem fills the other half of the study document

---

## Cross-Industry Scope

The same framework applies across domains because the underlying question is universal:

> How do patterns behave under different conditions?

Architecture, urban design, landscape, product design, textiles, data visualization, science communication, AI design tooling — any domain where hidden dynamics can be made visible.

---

## One-Sentence Definition

> An emergent design framework for composing pattern-makers, worlds, pressures, and readouts so specialists can visually discover how complex systems behave across different contexts.
