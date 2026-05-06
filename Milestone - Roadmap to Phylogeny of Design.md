# Implementation Roadmap: The Phylogeny of Design

This roadmap outlines the step-by-step process for validating the **Cross-Dimension Hypothesis** through structured experimentation in the emergent design sandbox.

---

## Phase 1: Infrastructure Consolidation

**Goal:** Prepare the shared environment where different "Actors" can interact.

1.  **Standardize the World (The Pot):**
    - Ensure all artifacts use the same coordinate convention (e.g., the `[-1, +1]²` unit disk) [cite: 130, 131].
    - Implement a "Multi-Actor Controller" that can load and step multiple pattern-makers simultaneously in one canvas.
2.  **Canonical Metabolism (The Fuel):**
    - Update the `UMAT.EnergyField` to include smooth disk-edge falloff (v1.1) to avoid stair-stepping at high resolutions [cite: wake-gap-audit.md].
    - Ensure the field has a single "Source of Truth" buffer that both the Vine and the Scout can read/write to every frame [cite: 140, 141].
3.  **Global Readout Tools (The Camera):**
    - Integrate a **Lineage** tracker as a shared service that records "Node Birth/Death" events across all species [cite: 128, 129].
    - Build a **Phylogeny** visualizer (a branching tree diagram) that renders alongside the simulation to track evolutionary splits.

---

## Phase 2: Experiment 01 — "The Vine vs. The Scout"

**Goal:** Observe resource competition and strategy efficiency.

1.  **Define Strategy Requirements:**
    - **Strategy A (The Vine):** Differential growth; slow-moving; high surface area (Slow Frill logic) [cite: 120].
    - **Strategy B (The Scout):** Chaotic foraging; fast-moving; low surface area (Wake logic) [cite: wake-gap-audit.md].
2.  **The Collision Test:**
    - **Step 1:** Spawn one Vine and one Scout at opposite ends of the world.
    - **Step 2:** Set `replenish` to a low value (Scarcity mode) [cite: 125, 143].
    - **Step 3:** Measure **Resilience**. Does the energy field "heal" faster than the Scout can deplete it? [cite: wake-gap-audit.md].
3.  **Observation & Reporting:**
    - Identify the **Extinction Event**. If an actor dies, use the Lineage Map to find the "Famine Coordinate" (where energy hit zero).
    - Analyze **Phylogeny**. Did the Vine evolve tighter ruffles specifically where the Scout "grazed" the energy field?

---

## Phase 3: The Phylogeny Unlock

**Goal:** Move from observing single runs to mapping the "Family Tree of Design."

1.  **Innovation Benchmarking:**
    - Run automated simulations with varying "Weather" (Pressure/Metabolism settings) [cite: 125, 130].
    - Map results into a **Phylogeny of Design** catalog.
2.  **Cross-Dimension Validation:**
    - Identify "Cousin" behaviors. (e.g., Does a "Starving Vine" in high-scarcity look like a "Foraging Path" in high-flow?)
    - Document **Interaction Effects** as reusable design patterns [cite: 148, 149].

---

## Phase 4: Expansion & Handoff

**Goal:** Prove the framework works for specialists outside of biology.

1.  **The "World Swap" Challenge:**
    - Port the winning "Vine vs. Scout" logic into an **Architecture** world (e.g., a 3D building facade) [cite: 63, 77, 90].
    - Replace "Energy" with "Sunlight" or "Heat" [cite: 85, 88].
2.  **Automated Build Targets:**
    - Prepare documentation so an AI agent or human can say: _"Give me the most Resilient version of Strategy B for this World."_ [cite: 112, 114].

---

## Technical Success Checklist

- [ ] Actors successfully "eating" from the same field (Multi-channel vs. Single-channel) [cite: 140].
- [ ] Lineage Map correctly identifying the cause of node death [cite: 128].
- [ ] Phylogeny tree showing a "Split" between two different growth strategies.
- [ ] Proof of **Portability** (same logic in two different Worlds) [cite: 108, 120].
