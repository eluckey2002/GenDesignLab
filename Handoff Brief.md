# UMAT Handoff Brief — Genome Library Extraction

## Framework status as of this handoff

UMAT is a research framework for spatially-embedded, biologically-inspired, compositional dynamical systems. It decomposes such systems along five orthogonal axes: **Substrate, Generator, Pairing, Connector, Operations**. The orthogonality claim is the framework's central architectural bet and is being validated empirically through portable library extraction and cross-instance reuse.

**Important framing**: UMAT is a research framework, not a generative art toolkit. The visual outputs are observability instruments, not the deliverable. Build decisions should be evaluated against research-platform criteria (does it preserve orthogonality, does it instrument what it models, does it compose cleanly with prior libraries) rather than aesthetic criteria.

## Catalog state

Approximately seven working artifacts: String Theory (2D), 3D strange attractors viewer, non-Euclidean prototype, Hyperbolic Phyllotaxis, Spirograph Wallpaper, Slow Frill (differential growth + metabolism), Wake (Clifford attractor + foraging on energy field), Lineage (differential growth + heritable traits + selection). Penrose Life and Hyperbolic {7,3} Tiling are specced but not built.

## Library state

**UMAT.EnergyField (shipped, v1.1)** — scalar field on unit disk with `deposit`, `sample`, `step`, `render`, `stats`, `setConfig` API. Inlined in Lineage; standalone library file at `/mnt/project/umat-energy-field.js`. Validated across Slow Frill, Wake, and Lineage. v1.1 added soft disk-edge falloff. This is the reference shape for all future portable libraries: single file, no dependencies, deterministic, well-instrumented, carries its own visualization.

**UMAT.Genome (next, ~80% implicit in Lineage)** — to be extracted. This is the work for the next session.

## Lineage as Genome's source artifact

Lineage (`/home/claude/lineage/lineage.html`, also `/mnt/user-data/outputs/lineage.html`) implements heritable trait dynamics on a closed-ring differential-growth generator over EnergyField. Reading this artifact's source is the fastest path to understanding what Genome needs to extract.

Key Lineage components that should become Genome library responsibilities:

- Genome trait schema (4 traits: hue, threshold, growth, jitter)
- `makeGenome(hue)` — founder genome construction
- `mutateGenome(parent)` — Gaussian mutation per trait with circular wrap for hue, clipping for scalars
- `gauss()` Box-Muller standard normal sampler
- Lineage tracking arrays: `lineageNodeCount`, `colonyPeak`, `colonyBornTick`, `colonyExtinctTick`, `colonyMeanHue`
- `computeMeanHues()` — circular mean via summed unit vectors and atan2 (not arithmetic mean)
- `signedHueDiff(current, founder)` — signed shortest-arc difference in (-180°, +180°]
- `colonyStatus(i)` — thriving/fading/extinct enum
- `aliveLineages()`, `extinctLineages()` — count predicates
- Random-parent inheritance pattern (50/50 between edge endpoints, not lower-index parent)

Key Lineage components that should stay artifact-level (NOT in Genome library):

- Trait-to-behavior mapping (what threshold _means_ mechanically — energy-gating splits)
- Visualization of traits (hue → curve color, drift → strip readout)
- Founding population structure (closed ring topology, contiguous arcs per founder)
- Death mechanism details (probability scaled by inverse local energy is artifact-specific; Genome should provide a generic `applyDeath(predicate)` hook instead)

## Hard-won lessons baked into Lineage that must survive extraction

These were each discovered through bug rounds during the Lineage build. The Genome library API must preserve each:

1. **Random-parent inheritance is the correct default.** Parent-A inheritance creates clockwise lineage drift — an indexing artifact, not biology. The library's default inheritance operator must be 50/50 random parent selection from a parent pair.

2. **Hue is circular; arithmetic mean is wrong.** The library must provide circular-mean primitives for any wrap-around trait. Naive arithmetic mean of {350°, 10°} gives 180° — a ridiculous DRIFT readout. Use `atan2` of summed unit vectors.

3. **Mutation kernels are per-trait, with type-aware clipping or wrapping.** The library should provide named kernels: `gaussian` (with optional clip range), `circular_gaussian` (with wrap range), `log_normal` (for scale traits), `categorical` (for discrete traits).

4. **PRNG must be injectable.** Lineage uses an internal xorshift32; the library should accept an external PRNG source so consumers can reproduce runs deterministically. This was _not_ in Lineage v1 but should be in the library.

5. **LineageRegistry uses typed arrays.** Same perf-conscious pattern as EnergyField (Int32Array, Float32Array). At Nmax=1200 nodes, hot-path allocations cause GC churn. Hoist buffers, reuse them.

6. **Death must be observable, not just stochastic.** When a lineage hits zero nodes, capture the tick. This is the only way to know _when_ extinction happened, which is required for any later Phylogeny work.

7. **Build adjacency / state during construction, not post-hoc.** General UMAT principle. For Genome specifically: lineage membership is set at birth and is immutable; never derive lineage from current state.

## Proposed UMAT.Genome API

Reference shape, to be refined during extraction:

```
UMAT.Genome
├── TraitSchema        — declares trait types and mutation kernels per trait
├── Genome             — trait vector instance conforming to a schema
├── MutationKernels    — gaussian, circular_gaussian, log_normal, categorical
├── Inheritance        — clone_with_mutation, blend (recombination), random_parent
└── LineageRegistry    — per-founding-ID: count, peak, age, mean_trait, born_tick, extinct_tick
```

Public surface (sketch):

```javascript
const schema = TraitSchema(
  {
    hue: { kernel: "circular_gaussian", sigma: 10, range: [0, 360] },
    threshold: { kernel: "gaussian", sigma: 0.04, clip: [0.05, 0.98] },
    growth: { kernel: "gaussian", sigma: 0.04, clip: [0.05, 1.0] },
  },
  { rng: myPRNG },
);

const founderGenome = schema.makeGenome({
  hue: 0,
  threshold: 0.6,
  growth: 0.02,
});
const child = schema.mutate(founderGenome);
const blended = schema.blend(parentA, parentB);

const reg = LineageRegistry(N_FOUNDERS, { trackTraits: ["hue"] });
reg.recordBirth(lineageId, t);
reg.recordDeath(lineageId, t);
reg.updateMeanTrait(lineageId, "hue", currentHue);
const snapshot = reg.snapshot(); // → [{ id, count, peak, age, meanTrait, extinctTick }, ...]
```

## Atomic extraction plan

1. **Read Lineage source end-to-end.** File: `/home/claude/lineage/lineage.html`. Identify every site that touches a genome or a lineage stat. Note dependencies on global SIM state — these need to become library inputs.

2. **Define TraitSchema declarative API.** Choose between class-based and factory-function approaches. EnergyField uses factory functions; recommend matching for consistency. _Checkpoint:_ schema declaration round-trips through `makeGenome` correctly.

3. **Implement mutation kernels in isolation.** Pure functions of `(parentValue, sigma, rng)`. Unit-testable without any larger context. _Checkpoint:_ kernels produce expected distributions over many samples; circular kernels wrap correctly across boundaries.

4. **Implement Inheritance operators.** `clone_with_mutation` is the simplest case. `random_parent` is the default and must be the recommended path. `blend` is for future recombination work. _Checkpoint:_ random-parent operator yields ~50/50 inheritance over many trials.

5. **Implement LineageRegistry.** Typed arrays, ringbuffer-shaped where applicable. Mean-trait tracking uses circular math when configured. _Checkpoint:_ registry state matches Lineage's manual bookkeeping when run on identical inputs.

6. **Port Lineage to use UMAT.Genome.** Replace inline genome code with library calls. _Checkpoint:_ dynamics match pre-port headless-test snapshot trajectories within statistical noise. Use `/home/claude/lineage/test_headless.js` as the reference test harness — its existing trajectory numbers are the regression baseline.

7. **Validate by porting a second artifact.** Wake-with-heritage is the cleanest candidate: agent's Clifford parameters become a 4-trait genome; on regular intervals, agent splits into two with mutated parameters. _Checkpoint:_ Wake-with-heritage runs without library modifications. Time-to-build should be substantially less than Lineage's was — that is the compounding-leverage signal.

## Development methodology (preserve)

- Atomic step-by-step implementation with explicit validation criteria before proceeding
- Headless test harness for any non-trivial dynamics; use Lineage's `test_headless.js` pattern (Node.js, mocked DOM, simulator extraction via regex from HTML)
- Single-file HTML prototypes with inlined libraries during development; libraries become standalone files only after second-instance validation
- Frontend skill consultation before any UI work (`/mnt/skills/public/frontend-design/SKILL.md`)
- Match existing UMAT visual idiom: Cormorant Garamond italic + JetBrains Mono, dark warm-neutral background, single accent color (per-artifact), corner brackets, italic climate line, instrumented diagnostic strips

## Project knowledge resources

Searchable via `project_knowledge_search`:

- `axes.md`, `framework-specification-v2_2.md`, `type-system-specification-v1.md` — framework architecture
- `catalog.md`, `art-traditions-matrix.md` — instance catalog and gap analysis
- `project-learnings-catalog.md` — accumulated build lessons
- `umat-energy-field_README.md`, `umat-energy-field.js` — reference library implementation
- `wake-gap-audit.md`, `wake.html` — aesthetic and structural reference
- `Penrose_Pulse`, `Slow_Frill_use_of_Energy_Field` — additional system specs

## Next

- Phylogeny library
- Cross-Domain Phase - see roadmap

## Out of scope for the Genome session

- Public release, packaging, documentation for external users
- Renaming UMAT (the _Art_ in the acronym is a known issue, deferred)

## Success criteria for the Genome extraction

The session is successful if:

1. UMAT.Genome ships as a single standalone file with the same shape discipline as EnergyField
2. Lineage is ported to consume the library with no behavioral regression (headless test trajectories match baseline)
3. A second artifact is ported using the library, with build time substantially below from-scratch baseline
4. The library's API is judged sufficient to cleanly support a future Phylogeny library layered on top of it (i.e., birth/death events are exposed cleanly enough that an external observer can record ancestry without library modification)

That last criterion is the most important. Genome is not just for Lineage; it's the foundation Phylogeny will build on. The extraction must leave the right hooks in place.

---

End of brief.
