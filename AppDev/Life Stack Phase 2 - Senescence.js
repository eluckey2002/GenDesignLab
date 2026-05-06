

/**
 * UMAT.Senescence (Phase 2)
 * * The standardized "Governor" for the Emergent Design Life Stack.
 * Manages population pressure and the circular energy economy.
 * * CORE RULES:
 * 1. Death is probabilistic, scaled by Population Pressure (N / N_cap).
 * 2. Starvation is a staggered counter, allowing for recovery.
 * 3. Recycling: Death returns energy to the field (Necromass).
 */

(function (global) {
  'use strict';

  /**
   * @param {Object} options
   * @param {number} options.n_cap - Carrying capacity of the world.
   * @param {number} options.e_starve - Energy threshold for stress (0..1).
   * @param {number} options.t_starve - Frames of stress before eligibility for death.
   * @param {number} options.p_death_max - Max probability of death per frame.
   * @param {number} options.k_recycling - Energy returned to field on death.
   */
  function Senescence(opts) {
    const cfg = Object.assign({
      n_cap: 1400,
      e_starve: 0.10,
      t_starve: 240,
      p_death_max: 0.018,
      k_recycling: 0.05, // Return a small pulse of energy to the grave
    }, opts || {});

    /**
     * Updates a node's starvation counter.
     * @param {Object} node - Must have a 'starve' property.
     * @param {number} e - Local energy sample [0..1].
     */
    function updateStress(node, e) {
      if (node.starve === undefined) node.starve = 0;

      if (e < cfg.e_starve) {
        node.starve += 1;
      } else {
        // Recovery is faster than depletion to prevent death from minor flickers
        node.starve = Math.max(0, node.starve - 2);
      }
    }

    /**
     * Determines if a node should die based on individual stress and global pressure.
     * @param {Object} node - The node to check.
     * @param {number} currentN - Current population size.
     * @param {Object} field - The EnergyField instance (for recycling).
     * @param {number} x, y - Coordinates for recycling deposit.
     * @returns {boolean} - Returns true if node should be removed.
     */
    function shouldDie(node, currentN, field, x, y) {
      // 1. Threshold check: Is the node even eligible?
      if (node.starve < cfg.t_starve) return false;

      // 2. Population Pressure Calculation
      const popFrac = currentN / cfg.n_cap;
      let popScale = 0;

      if (popFrac < 0.30) {
        popScale = 0; // Protected Zone: System too young to die.
      } else if (popFrac > 0.85) {
        popScale = 1; // Crowded Zone: Full mortality rate.
      } else {
        // Active Zone: Linear lerp of death probability.
        popScale = (popFrac - 0.30) / (0.85 - 0.30);
      }

      // 3. Probability Roll
      const pDeath = cfg.p_death_max * popScale;
      const deathRoll = Math.random() < pDeath;

      if (deathRoll) {
        // Circular Economy: Return energy to the field on death.
        if (field && x !== undefined && y !== undefined) {
          // Negative deposit = Energy addition.
          field.deposit(x, y, -cfg.k_recycling);
        }
        return true;
      }

      return false;
    }

    function setConfig(patch) {
      Object.assign(cfg, patch);
    }

    return {
      updateStress,
      shouldDie,
      setConfig,
      get config() { return cfg; }
    };
  }

  // Export
  global.UMAT = global.UMAT || {};
  global.UMAT.Senescence = Senescence;

})(typeof window !== 'undefined' ? window : this);