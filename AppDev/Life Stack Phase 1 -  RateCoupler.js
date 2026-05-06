/**
 * UMAT.RateCoupler (Phase 1)
 * * The standardized "Transmission" for the Emergent Design Life Stack.
 * Implements the Stochastic Linger rule discovered in the Wake Audit.
 * * CORE RULE:
 * For non-linear and chaotic systems, do NOT modulate step size. 
 * Modulate step frequency based on local energy availability.
 */

(function (global) {
  'use strict';

  /**
   * @param {Object} options
   * @param {number} options.forage_strength [0..1] - How much energy dictates lingering.
   * 1.0 = Max intelligence (never moves from food until depleted).
   * 0.0 = Random walk (ignores metabolism).
   */
  function RateCoupler(opts) {
    const cfg = Object.assign({
      forage_strength: 0.7,
    }, opts || {});

    /**
     * The primary evaluation hook for the Life Stack.
     * * @param {Object} generator - The Pattern-maker (must implement step()).
     * @param {Object} field - The UMAT.EnergyField instance.
     * @param {number} x - World X coordinate [-1, +1].
     * @param {number} y - World Y coordinate [-1, +1].
     * @param {number} species_forage_strength - (Optional) Inherited trait override.
     * * @returns {boolean} - Returns true if a step was taken, false if lingering.
     */
    function evaluate(generator, field, x, y, species_forage_strength) {
      // 1. Sample the field
      const e = field.sample(x, y);
      
      // 2. Determine Forage Strength (Species Trait > Global Constant)
      const fs = (species_forage_strength !== undefined) ? species_forage_strength : cfg.forage_strength;

      // 3. Roll for Linger (Stochastic Linger Rule)
      // High Energy (e -> 1) + High Forage Strength (fs -> 1) = High chance of Linger
      const lingerProbability = fs * e;
      
      // Use Math.random() or framework-seeded RNG
      const shouldLinger = Math.random() < lingerProbability;

      if (!shouldLinger) {
        // Chaos Preserved: Step is taken at full mathematical scale or not at all.
        generator.step();
        return true;
      }

      // Trajectory is "pinned" to the current coordinate to graze.
      return false;
    }

    function setConfig(patch) {
      Object.assign(cfg, patch);
    }

    return {
      evaluate,
      setConfig,
      get forage_strength() { return cfg.forage_strength; }
    };
  }

  // Export
  global.UMAT = global.UMAT || {};
  global.UMAT.RateCoupler = RateCoupler;

})(typeof window !== 'undefined' ? window : this);