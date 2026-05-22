# libraries/

EDF.\* portable modules. Single-file, no-deps. `EDF.EnergyField` is the reference shape — match its discipline (instrumented, deterministic, carries its own visualization, validated across multiple artifacts before standalone extraction).

Pillars (per Life Stack):

- Metabolism → `EDF.EnergyField` (shipped, currently in `AppDev/` mid-sort)
- Foraging → `EDF.RateCoupler` (shipped, currently in `AppDev/` mid-sort)
- Senescence → `EDF.Senescence` (shipped, currently in `AppDev/` mid-sort)
- Inheritance → `EDF.Genome` (pending)

Files will move into this folder as the user finishes sorting `AppDev/` and the UMAT→EDF branding sweep lands.
