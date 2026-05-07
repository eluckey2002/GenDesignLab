---
type: glossary
status: draft
audience: [agent, engineer, designer, researcher, reviewer]
framework: emergent-design-framework
component_id: glossary-v1
depends_on: [framework-onepager-v1]
---

# Glossary

Canonical definitions for the framework's vocabulary. Every other document in the framework references these terms in their canonical form. New components must declare themselves against this glossary rather than inventing parallel vocabulary.

This file is the single source of truth for what the framework's terms mean. If a term is used in another document and is not defined here, the document is non-conformant and the term should be added to this glossary or replaced.

## Primary categories

These five terms decompose any system the framework can express. The recipe `pattern-maker + world + pressure + readout = outcome` is the framework's defining formulation.

### pattern-maker

**Technical synonym:** generator

**Definition:** A component that creates form, motion, growth, or structure. The active element in a system; the thing that produces change over time.

**Examples:** branching growth, swarm movement, cellular tile generator, attractor trail, reaction-diffusion process.

**Used in `type:`** field as `pattern-maker`.

### world

**Technical synonym:** substrate

**Definition:** The space, surface, or environment a pattern lives in. The passive context; defines what motion and growth are geometrically and topologically possible.

**Examples:** flat plane, curved facade, terrain mesh, network graph, building shell, textile surface, product enclosure.

**Used in `type:`** field as `world`.

### pressure

**Technical synonyms:** operation, field, constraint

**Definition:** A force that changes how a pattern behaves over time. The dynamic element; what produces selection, scarcity, attraction, or flow.

**Examples:** energy scarcity (metabolism), attraction/repulsion (force field), inheritance and mutation (lineage selection), circulation (vector field), congestion friction.

**Used in `type:`** field as `pressure`.

### readout

**Technical synonyms:** diagnostics, visualization

**Definition:** How the system's behavior is observed and recorded. The interpretive layer; defines what the user — human or agent — sees and measures from a run.

**Examples:** heatmap, lineage map, motion trail, structural form snapshot, density survival map, time-series of population counts.

**Used in `type:`** field as `readout`.

### outcome

**Technical synonyms:** artifact, system behavior

**Definition:** The visible result of running a `pattern-maker` in a `world` under a `pressure` and observing through a `readout`. The output of one full system instantiation.

**Examples:** an adaptive facade concept, a circulation study, a generative tessellation, an ecological model, a survival map.

**Used in `type:`** field as `outcome`.

## Operational terms

### emergent behavior

A behavior that arises from the interaction of pattern-maker + world + pressure but is not directly specified by any one of them. The framework exists to make these visible. A behavior is emergent if removing any one of the three components changes the result qualitatively, not just quantitatively.

### portability

The property that a pattern-maker built for one world can be moved into a different world with little or no adjustment. Portability is the framework's primary credibility signal: behaviors that don't port are ad hoc creative outputs; behaviors that do port are framework components. Portability is also a testable claim — a pattern-maker has been demonstrated to be portable when it has been successfully run in at least two distinct worlds.

### catalog

The growing collection of reusable pattern-makers, worlds, pressures, and readouts. The catalog grows by addition: each new working component adds another reusable building block. Combinatorial expansion happens at the catalog level, not within any single file. The catalog is implicit — it is the union of all files in the framework with `type:` set to one of the five primary categories.

### recipe

The formulation `pattern-maker + world + pressure + readout = outcome`. Any concrete system in the framework can be expressed as one recipe. Recipes are how an agent or developer is briefed: "take this pattern-maker, place it in this world, apply this pressure, observe through this readout." A recipe references specific `component_id`s from the catalog.

### composability

The property that catalog entries can be substituted for each other in a recipe. A catalog with N pattern-makers, M worlds, K pressures, and L readouts produces N×M×K×L addressable systems. Composability is what makes the catalog's value compound: each new entry multiplies, rather than adds to, the framework's expressive range.

## Term hygiene

Whimsical, alliterative, or metaphor-heavy names — for example "Slow Frill", "Penrose Pulse", or "wake" — are excluded from this glossary by design. Names of that form classify the work as creative output rather than as framework components when read by AI agents and indexing systems.

New components are named after their behavior or function (`branching-growth`, `curved-substrate`, `energy-scarcity-pressure`), not after their aesthetic. Existing files using whimsical names should be renamed against this convention as part of the audit pass (see forthcoming `03_File_Audit.md`).

## How to use this glossary

When writing a new document:

1. Find the term that names what you are describing.
2. Use the canonical form. If your work introduces a new term, add it here first, then use it in your document.
3. Reference this glossary in your document's `depends_on` field as `glossary-v1`.

When reading a document:

1. If a term is unfamiliar, look it up here first.
2. If the term is not here, the document is non-conformant — either the glossary is incomplete or the document is using ad hoc vocabulary. Both are repairable; neither should be silently accepted.
