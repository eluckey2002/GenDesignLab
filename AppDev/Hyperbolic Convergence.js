import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Zap, Info, TrendingUp, Activity } from 'lucide-react';

/**
 * UMAT HYPERBOLIC LAB (Phase 5)
 * Porting the Life Stack to a Poincaré Disk.
 * Metric: ds = 2|dz| / (1 - |z|^2)
 */

const App = () => {
  const canvasRef = useRef(null);
  const linCanvasRef = useRef(null);
  const [vitals, setVitals] = useState({ metabolism: 1.0, treeN: 0, swarmN: 0, state: 'STABLE' });
  const [params, setParams] = useState({ replenish: 0.0025, jump: 0.02, curvature: 1.0 });
  const [logs, setLog] = useState(['Hyperbolic Frontier initialized.']);

  // Simulation State Refs
  const sim = useRef({
    treeNodes: [],
    swarmAgents: [],
    energy: new Float32Array(64 * 64).fill(1.0),
    history: [],
    frame: 0
  });

  const addLog = (msg) => setLog(prev => [`[${sim.current.frame}] ${msg}`, ...prev].slice(0, 5));

  // --- CORE LIFE STACK LOGIC ---
  const LifeStack = {
    // Hyperbolic sampling
    sampleEnergy: (x, y) => {
      const FS = 64;
      const gx = Math.floor((x + 1) * 0.5 * (FS - 1));
      const gy = Math.floor((y + 1) * 0.5 * (FS - 1));
      if (gx < 0 || gx >= FS || gy < 0 || gy >= FS) return 0;
      return sim.current.energy[gy * FS + gx];
    },
    
    deposit: (x, y, amt) => {
      const FS = 64;
      const gx = Math.round((x + 1) * 0.5 * (FS - 1));
      const gy = Math.round((y + 1) * 0.5 * (FS - 1));
      if (gx >= 0 && gx < FS && gy >= 0 && gy < FS) {
        sim.current.energy[gy * FS + gx] = Math.max(0, sim.current.energy[gy * FS + gx] - amt);
      }
    },

    mutate: (parent, keys) => {
      const child = { ...parent };
      keys.forEach(k => {
        const isJump = Math.random() < params.jump;
        const s = isJump ? 0.4 : 0.02;
        const delta = (Math.random() + Math.random() - 1) * s;
        child[k] = Math.max(0.05, Math.min(0.95, child[k] + delta));
      });
      child.gen = (parent.gen || 0) + 1;
      return child;
    }
  };

  const resetSim = () => {
    sim.current.energy.fill(1.0);
    sim.current.treeNodes = [{ x: 0, y: 0, starve: 0, traits: { threshold: 0.55, hue: 145, gen: 0 } }];
    sim.current.swarmAgents = Array.from({ length: 15 }, () => ({
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
      ax: Math.random(), ay: Math.random(),
      starve: 0,
      traits: { forage: 0.65, hue: 45, gen: 0 }
    }));
    sim.current.frame = 0;
    sim.current.history = [];
    addLog("Disk reseeded. Curvature set.");
  };

  const triggerCataclysm = () => {
    sim.current.treeNodes = sim.current.treeNodes.filter(() => Math.random() > 0.95);
    sim.current.swarmAgents = sim.current.swarmAgents.filter(() => Math.random() > 0.9);
    sim.current.energy.fill(0.02);
    addLog("!!! EXTINCTION EVENT !!!");
  };

  useEffect(() => {
    resetSim();
    let anim;
    const FS = 64;

    const loop = () => {
      const { treeNodes, swarmAgents, energy } = sim.current;
      
      // 1. Metabolism Step (Diffusion + Replenish)
      for (let i = 0; i < energy.length; i++) energy[i] += (1.0 - energy[i]) * params.replenish;

      // 2. Swarm Logic (Hyperbolic RateCoupler)
      sim.current.swarmAgents.forEach(a => {
        const r2 = a.x*a.x + a.y*a.y;
        const metric = 1.0 - r2; // Simulating the Poincaré slowdown
        const e = LifeStack.sampleEnergy(a.x, a.y);
        
        // Stochastic Linger
        if (Math.random() > (a.traits.forage * e)) {
          // Hyperbolic Translation Approximation
          const nx = Math.sin(-1.4 * a.ay) + Math.cos(-1.4 * a.ax);
          const ny = Math.sin(1.6 * a.ax) + 0.7 * Math.cos(1.6 * a.ay);
          a.ax = nx; a.ay = ny;
          // Step size is scaled by metric: objects move "slower" as they hit the boundary
          // But internally they are covering exponential ground.
          a.x += (nx * 0.01) * metric;
          a.y += (ny * 0.01) * metric;
        }

        LifeStack.deposit(a.x, a.y, 0.008);
        if (e > 0.9 && Math.random() < 0.01 && swarmAgents.length < 1200) {
          swarmAgents.push({ ...a, starve: 0, traits: LifeStack.mutate(a.traits, ['forage', 'hue']) });
        }
      });

      // 3. Tree Logic (Hyperbolic Branching)
      const buds = [];
      sim.current.treeNodes.forEach(n => {
        const r2 = n.x*n.x + n.y*n.y;
        const metric = 1.0 - r2;
        const e = LifeStack.sampleEnergy(n.x, n.y);
        LifeStack.deposit(n.x, n.y, 0.003);

        if (e > n.traits.threshold && Math.random() < 0.015 && treeNodes.length < 1200) {
          const ang = Math.random() * Math.PI * 2;
          const d = 0.04 * metric; // Branch size shrinks near edge
          buds.push({ x: n.x + Math.cos(ang)*d, y: n.y + Math.sin(ang)*d, starve: 0, traits: LifeStack.mutate(n.traits, ['threshold', 'hue']) });
        }
      });
      sim.current.treeNodes.push(...buds);

      // 4. Pruning
      sim.current.swarmAgents = sim.current.swarmAgents.filter(a => {
        const e = LifeStack.sampleEnergy(a.x, a.y);
        if (e < 0.1) a.starve++; else a.starve = Math.max(0, a.starve - 2);
        return a.starve < 180 && (a.x*a.x + a.y*a.y < 0.98);
      });
      sim.current.treeNodes = sim.current.treeNodes.filter(n => {
        const e = LifeStack.sampleEnergy(n.x, n.y);
        if (e < 0.1) n.starve++; else n.starve = Math.max(0, n.starve - 2);
        return n.starve < 180 && (n.x*n.x + n.y*n.y < 0.98);
      });

      // Draw
      draw();
      sim.current.frame++;
      if (sim.current.frame % 60 === 0) {
        setVitals({
          metabolism: energy.reduce((a,b)=>a+b,0) / energy.length,
          treeN: sim.current.treeNodes.length,
          swarmN: sim.current.swarmAgents.length,
          state: energy.reduce((a,b)=>a+b,0) / energy.length < 0.4 ? 'FAMINE' : 'ACTIVE'
        });
        sim.current.history.push({
          tree: sim.current.treeNodes.map(t => t.traits.threshold),
          swarm: sim.current.swarmAgents.map(s => s.traits.forage)
        });
        if (sim.current.history.length > 100) sim.current.history.shift();
        drawLineage();
      }
      anim = requestAnimationFrame(loop);
    };

    const draw = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.fillStyle = '#050607';
      ctx.fillRect(0, 0, 800, 800);
      const cx = 400, cy = 400, r = 380;

      // Render Field
      const step = (r*2)/64;
      for(let j=0; j<64; j++) {
        for(let i=0; i<64; i++) {
          const v = sim.current.energy[j*64+i];
          if (v < 0.98) {
            ctx.fillStyle = `rgba(200, 160, 100, ${ (1-v)*0.3 })`;
            ctx.fillRect(cx - r + i*step, cy - r + j*step, step+1, step+1);
          }
        }
      }

      // Border
      ctx.strokeStyle = '#1a1d22';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.stroke();

      // Species
      sim.current.treeNodes.forEach(n => {
        const r2 = n.x*n.x + n.y*n.y;
        const size = 2 * (1-r2);
        ctx.fillStyle = `hsla(${n.traits.hue}, 50%, 60%, 0.8)`;
        ctx.beginPath(); ctx.arc(cx + n.x*r, cy + n.y*r, Math.max(0.5, size), 0, Math.PI*2); ctx.fill();
      });
      sim.current.swarmAgents.forEach(a => {
        const r2 = a.x*a.x + a.y*a.y;
        const size = 3.5 * (1-r2);
        ctx.fillStyle = `hsla(${a.traits.hue}, 80%, 70%, 1.0)`;
        ctx.beginPath(); ctx.arc(cx + a.x*r, cy + a.y*r, Math.max(1, size), 0, Math.PI*2); ctx.fill();
      });
    };

    const drawLineage = () => {
      const ctx = linCanvasRef.current.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 300, 120);
      const dx = 300 / 100;
      sim.current.history.forEach((snap, idx) => {
        const x = idx * dx;
        snap.tree.forEach(v => {
          ctx.fillStyle = 'hsla(140, 40%, 60%, 0.2)';
          ctx.fillRect(x, 120 * (1-v), 2, 2);
        });
        snap.swarm.forEach(v => {
          ctx.fillStyle = 'hsla(45, 80%, 70%, 0.2)';
          ctx.fillRect(x, 120 * (1-v), 2, 2);
        });
      });
    };

    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [params]);

  return (
    <div className="flex h-screen bg-zinc-950 text-slate-200 font-mono text-[11px] overflow-hidden">
      <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,_#0a0c0e_0%,_#050607_100%)]">
        <div className="absolute top-6 left-8 flex flex-col gap-1">
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Frontier Lab</div>
          <div className="text-xl font-serif italic text-zinc-300">Phase 5: Hyperbolic Foraging</div>
        </div>
        <canvas ref={canvasRef} width={800} height={800} className="max-w-full max-h-full aspect-square" />
      </div>

      <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col gap-6 overflow-y-auto">
        <section className="flex flex-col gap-2">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-1 flex justify-between">
            <span>System Vitals</span>
            <span className={vitals.state === 'FAMINE' ? 'text-red-400' : 'text-cyan-400'}>{vitals.state}</span>
          </div>
          <div className="flex justify-between items-baseline pt-2">
            <span>Metabolic Mean</span>
            <span className="text-lg text-white">{vitals.metabolism.toFixed(3)}</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-400 transition-all duration-500" style={{ width: `${vitals.metabolism * 100}%` }} />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-1">Lineage Drift</div>
          <div className="bg-black border border-zinc-800 rounded p-1">
            <canvas ref={linCanvasRef} width={300} height={120} className="w-full h-24" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="flex justify-between border border-zinc-800 p-2">
              <span className="text-emerald-400">Tree (N)</span>
              <span>{vitals.treeN}</span>
            </div>
            <div className="flex justify-between border border-zinc-800 p-2">
              <span className="text-orange-400">Swarm (N)</span>
              <span>{vitals.swarmN}</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-1">Curvature Control</div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-zinc-500 flex justify-between">REPLENISH <span>{params.replenish.toFixed(4)}</span></label>
              <input type="range" min="0.0001" max="0.01" step="0.0001" value={params.replenish} 
                onChange={e => setParams(p => ({ ...p, replenish: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-zinc-500 flex justify-between">JUMP MUTATION <span>{params.jump.toFixed(3)}</span></label>
              <input type="range" min="0" max="0.2" step="0.005" value={params.jump} 
                onChange={e => setParams(p => ({ ...p, jump: parseFloat(e.target.value) }))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-500" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <button onClick={triggerCataclysm} className="flex items-center justify-center gap-2 border border-red-900/50 bg-red-950/20 hover:bg-red-900/40 text-red-400 py-2 rounded transition-colors uppercase tracking-widest text-[9px]">
              <Zap size={12} /> Trigger Cataclysm
            </button>
            <button onClick={resetSim} className="flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 py-2 rounded transition-colors uppercase tracking-widest text-[9px]">
              <RotateCcw size={12} /> Reset Frontier
            </button>
          </div>
        </section>

        <section className="mt-auto pt-4 border-t border-zinc-800 overflow-hidden">
          <div className="flex flex-col gap-1">
            {logs.map((l, i) => <div key={i} className="text-[9px] text-zinc-600 font-mono leading-tight truncate">{l}</div>)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;