import {
  Suspense,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useThree } from "@react-three/fiber";
import { Instances, Instance, useProgress } from "@react-three/drei";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import Dome from "./Dome";
import { useNavigate } from "react-router-dom";
//THREE.Cache.enabled = true;

// ─────────────────────────────────────────────
// PRELOADS — Layer 1 only (tracked by loader screen)
// Layer 2 & 3 load on-demand after loader hides
// ─────────────────────────────────────────────
useGLTF.preload("/homepage/models/tree.glb");
useGLTF.preload("/homepage/models/mountain.glb");
useGLTF.preload("/homepage/models/blue_base.glb");
useGLTF.preload("/homepage/models/windmill.glb");
useGLTF.preload("/homepage/models/crops.glb");
useGLTF.preload("/homepage/models/farm.glb");
useGLTF.preload("/homepage/models/Cabin.glb");
useTexture.preload("/homepage/images/icon_0.png");
useTexture.preload("/homepage/images/icon_1.png");
useTexture.preload("/homepage/images/icon_2.png");
useTexture.preload("/homepage/images/icon_3.png");
useTexture.preload("/homepage/images/icon_4.png");
useTexture.preload("/homepage/images/icon_5.png");
useTexture.preload("/homepage/images/icon_6.png");

// ─────────────────────────────────────────────────────────────
//  PHASE 1 — FULL-SCREEN LOADER
//  Shown while the first layer of assets loads.
//  Calls onReady() when progress >= 100 OR after 15 s max.
//  City canvas is rendering behind it but hidden by the black bg.
// ─────────────────────────────────────────────────────────────
export function CityLoaderScreen({ allDone }) {
  const { progress: realProgress } = useProgress();
  const [visualPct, setVisualPct] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);

  // 1. Forced Visual Counter (Solves the "Instant 100" jump)
  useEffect(() => {
    const interval = setInterval(() => {
      setVisualPct((prev) => {
        if (prev >= 99) {
          // Stay at 99 until Three.js says assets are ready (realProgress) 
          // AND parent says animation is done (allDone)
          if (allDone && realProgress >= 100) return 100;
          return 99;
        }
        return prev + 1;
      });
    }, 40); // Counts to 100 in approx 4 seconds

    return () => clearInterval(interval);
  }, [allDone, realProgress]);

  const hide = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFadeOut(true);
    setTimeout(() => setHidden(true), 800);
  }, []);

  // 2. Trigger Exit when simulation hits 100
  useEffect(() => {
    if (allDone && visualPct >= 100) {
      const timeout = setTimeout(hide, 600); // Brief pause at 100%
      return () => clearTimeout(timeout);
    }
  }, [allDone, visualPct, hide]);

  if (hidden) return null;

  const barsFilled = Math.floor((visualPct / 100) * 20);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at 60% 40%, #0a1a0a 0%, #000d00 60%, #000 100%)",
        transition: "opacity 0.8s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Background Grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,255,80,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,80,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", animation: "lsGridPulse 4s ease-in-out infinite" }} />

      {/* Hexagon Spinner */}
      <div style={{ position: "relative", marginBottom: 44 }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ animation: "lsSpin 6s linear infinite", display: "block" }}>
          <polygon points="60,8 104,34 104,86 60,112 16,86 16,34" fill="none" stroke="rgba(0,255,80,0.6)" strokeWidth="2" strokeDasharray="8 4" />
          <polygon points="60,20 94,39 94,81 60,100 26,81 26,39" fill="none" stroke="rgba(0,255,80,0.22)" strokeWidth="1" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, filter: "drop-shadow(0 0 14px rgba(0,255,80,0.9))", animation: "lsIconPulse 2s ease-in-out infinite" }}>🏙️</div>
      </div>

      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 12, letterSpacing: "0.5em", color: "rgba(0,255,80,0.5)", marginBottom: 8 }}>INITIALIZING WORLD</div>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 26, fontWeight: 700, letterSpacing: "0.18em", color: "#00ff50", textShadow: "0 0 20px rgba(0,255,80,0.7)", marginBottom: 44 }}>CITY LOADING</div>

      {/* Progress Bar Bars */}
      <div style={{ display: "flex", gap: 3, marginBottom: 18 }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 28,
              borderRadius: 2,
              background: i < barsFilled ? "rgba(0,255,80,0.9)" : "rgba(0,255,80,0.07)",
              border: "1px solid rgba(0,255,80,0.18)",
              transition: "background 0.2s ease",
              boxShadow: i < barsFilled ? "0 0 8px rgba(0,255,80,0.55)" : "none",
            }}
          />
        ))}
      </div>

      {/* Numerical Percentage */}
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 40, fontWeight: 700, color: "#00ff50", textShadow: "0 0 28px rgba(0,255,80,0.8)", lineHeight: 1, marginBottom: 10 }}>
        {visualPct}<span style={{ fontSize: 17, color: "rgba(0,255,80,0.55)" }}>%</span>
      </div>

      {/* YOUR TICKER COMPONENT INTEGRATED HERE */}
      <LoaderTicker progress={visualPct} />

      <style>{`
        @keyframes lsGridPulse  { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes lsSpin       { to{transform:rotate(360deg)} }
        @keyframes lsIconPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes lsTicker     { 0%{opacity:0;transform:translateY(10px)} 10%{opacity:1;transform:translateY(0)} 90%{opacity:1} 100%{opacity:0} }
      `}</style>
    </div>
  );
}

function LoaderTicker({ progress }) {
  const msgs = [
    "Compiling shaders…",
    "Loading terrain…",
    "Placing mountains…",
    "Growing trees…",
    "Laying roads…",
    "Initializing domes…",
    "Baking lighting…",
    "Almost there…",
  ];
  const msg =
    msgs[Math.min(Math.floor((progress / 100) * msgs.length), msgs.length - 1)];
  return (
    <div
      style={{
        fontFamily: "'Courier New',monospace",
        fontSize: 10,
        color: "rgba(0,255,80,0.5)",
        letterSpacing: "0.18em",
        height: 18,
        overflow: "hidden",
      }}
    >
      <span
        key={msg}
        style={{ display: "block", animation: "lsTicker 2.2s ease forwards" }}
      >
        ▸ {msg.toUpperCase()}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PHASE 2 — TOP BANNER
//  Shown after the loader hides while Layer 2 & 3 are streaming.
//  pointerEvents: "none" — never blocks clicks on the canvas.
//  The dome-click block comes from domsLocked prop in City.
//  Banner disappears when parent sets done=true.
// ─────────────────────────────────────────────────────────────
export function CityLoadingBanner({ done }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setHidden(true), 900);
      return () => clearTimeout(t);
    }
  }, [done]);

  if (hidden) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 8000,
        pointerEvents: "none", // ← NEVER blocks canvas clicks
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "opacity 0.7s ease",
        opacity: done ? 0 : 1,
      }}
    >
      {/* Main banner strip */}
      <div
        style={{
          width: "100%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 70%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 14,
          paddingBottom: 18,
          gap: 8,
        }}
      >
        {/* Bouncing dots + text */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 16,
                borderRadius: 3,
                background: "#00ff50",
                boxShadow: "0 0 7px #00ff50",
                animation: `bannerDot 1.1s ease-in-out ${i * 0.14}s infinite`,
              }}
            />
          ))}
          <span
            style={{
              fontFamily: "'Courier New',monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.35em",
              color: "#00ff50",
              textShadow: "0 0 12px rgba(0,255,80,0.7)",
              textTransform: "uppercase",
            }}
          >
            City Loading — Please Wait
          </span>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 5,
                height: 16,
                borderRadius: 3,
                background: "#00ff50",
                boxShadow: "0 0 7px #00ff50",
                animation: `bannerDot 1.1s ease-in-out ${i * 0.14}s infinite`,
              }}
            />
          ))}
        </div>
        {/* Sub-line */}
        <div
          style={{
            fontFamily: "'Courier New',monospace",
            fontSize: 9,
            letterSpacing: "0.28em",
            color: "rgba(0,255,80,0.5)",
            textTransform: "uppercase",
          }}
        >
          Domes will unlock when the city finishes loading
        </div>
      </div>

      {/* Thin green progress bar along very top edge */}
      <ProgressBar />
    </div>
  );
}

function ProgressBar() {
  const { progress } = useProgress();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "rgba(0,255,80,0.1)",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.round(progress)}%`,
          background: "linear-gradient(to right, rgba(0,255,80,0.4), #00ff50)",
          boxShadow: "0 0 10px rgba(0,255,80,0.8)",
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED TREE HOOK
// ─────────────────────────────────────────────
function useTreeAsset() {
  const { nodes, materials } = useGLTF("/homepage/models/tree.glb");
  const mesh = Object.values(nodes).find((n) => n.isMesh);
  return {
    geometry: mesh.geometry,
    material: mesh.material || materials[Object.keys(materials)[0]],
  };
}

// ─────────────────────────────────────────────
// INSTANCED COMPONENTS
// ─────────────────────────────────────────────
function InstancedRobos({ robos }) {
  const { nodes } = useGLTF("/homepage/models/robo.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={robos.length}
    >
      {robos.map((r, i) => (
        <Instance
          key={i}
          position={r.position}
          rotation={r.rotation}
          scale={r.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedBicycles({ bikes }) {
  const { nodes } = useGLTF("/homepage/models/bycycle.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={bikes.length}
    >
      {bikes.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedSheep({ sheep }) {
  const { nodes } = useGLTF("/homepage/models/sheep.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={sheep.length}
    >
      {sheep.map((s, i) => (
        <Instance
          key={i}
          position={s.position}
          rotation={s.rotation}
          scale={s.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedGoats({ goats }) {
  const { nodes } = useGLTF("/homepage/models/goat.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={goats.length}
    >
      {goats.map((g, i) => (
        <Instance
          key={i}
          position={g.position}
          rotation={g.rotation}
          scale={g.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedCows({ cows }) {
  const { nodes } = useGLTF("/homepage/models/Cow.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={cows.length}
    >
      {cows.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedBuildings({ buildings }) {
  const { nodes } = useGLTF("/homepage/models/building.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={buildings.length}
    >
      {buildings.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedSolarPanels({ panels }) {
  const { nodes } = useGLTF("/homepage/models/solarpanels.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={panels.length}
    >
      {panels.map((p, i) => (
        <Instance
          key={i}
          position={p.position}
          rotation={p.rotation}
          scale={p.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedCars({ cars }) {
  const { nodes } = useGLTF("/homepage/models/car.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={cars.length}
    >
      {cars.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedChickens({ chickens }) {
  const { nodes } = useGLTF("/homepage/models/chicken.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={chickens.length}
    >
      {chickens.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedResBuildings({ buildings }) {
  const { nodes } = useGLTF("/homepage/models/resbuilding.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={buildings.length}
    >
      {buildings.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedHorses({ horses }) {
  const { nodes } = useGLTF("/homepage/models/Horse.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={horses.length}
    >
      {horses.map((h, i) => (
        <Instance
          key={i}
          position={h.position}
          rotation={h.rotation}
          scale={h.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedBlueBase({ bases }) {
  const { nodes } = useGLTF("/homepage/models/blue_base.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={bases.length}
    >
      {bases.map((b, i) => (
        <Instance
          key={i}
          position={b.position}
          rotation={b.rotation}
          scale={b.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedWindmills({ windmills }) {
  const { nodes } = useGLTF("/homepage/models/windmill.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={windmills.length}
    >
      {windmills.map((w, i) => (
        <Instance
          key={i}
          position={w.position}
          rotation={w.rotation}
          scale={w.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedCrops({ crops }) {
  const { nodes } = useGLTF("/homepage/models/crops.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={crops.length}
    >
      {crops.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedFarms({ farms }) {
  const { nodes } = useGLTF("/homepage/models/farm.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={farms.length}
    >
      {farms.map((f, i) => (
        <Instance
          key={i}
          position={f.position}
          rotation={f.rotation}
          scale={f.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedCabins({ cabins }) {
  const { nodes } = useGLTF("/homepage/models/Cabin.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={cabins.length}
    >
      {cabins.map((c, i) => (
        <Instance
          key={i}
          position={c.position}
          rotation={c.rotation}
          scale={c.scale}
        />
      ))}
    </Instances>
  );
}
function InstancedMountains({ mountains }) {
  const { nodes } = useGLTF("/homepage/models/mountain.glb");
  const mesh = useMemo(
    () => Object.values(nodes).find((n) => n.isMesh),
    [nodes],
  );
  if (!mesh) return null;
  return (
    <Instances
      geometry={mesh.geometry}
      material={mesh.material}
      limit={mountains.length}
      castShadow
      receiveShadow
    >
      {mountains.map((m, i) => (
        <Instance
          key={i}
          position={m.position}
          rotation={m.rotation}
          scale={m.scale}
        />
      ))}
    </Instances>
  );
}
function AllTreeClusters({ clusters }) {
  const { geometry, material } = useTreeAsset();
  const allTrees = useMemo(
    () =>
      clusters.flatMap(({ position, count, spread }) =>
        Array.from({ length: count }, () => ({
          pos: [
            position[0] + (Math.random() - 0.5) * spread,
            position[1],
            position[2] + (Math.random() - 0.5) * spread,
          ],
          scale: 3 + Math.random() * 3,
          rot: Math.random() * Math.PI * 2,
        })),
      ),
    [],
  );
  return (
    <Instances geometry={geometry} material={material} limit={allTrees.length}>
      {allTrees.map((t, i) => (
        <Instance
          key={i}
          position={t.pos}
          rotation={[0, t.rot, 0]}
          scale={t.scale}
        />
      ))}
    </Instances>
  );
}
function AllRoadTrees({ radius }) {
  const { geometry, material } = useTreeAsset();
  const allTrees = useMemo(() => {
    const trees = [];
    const treeCount = 10;
    const segLen = radius * 1.15;
    for (let seg = 0; seg < 6; seg++) {
      const angle = (seg * Math.PI) / 3 + Math.PI / 6,
        cosA = Math.cos(angle),
        sinA = Math.sin(angle);
      for (let i = 0; i < treeCount; i++) {
        const z = i * (segLen / (treeCount - 1)) - segLen / 2,
          rot = Math.random() * Math.PI * 2;
        trees.push({
          pos: [
            cosA * (radius + 4) - sinA * z,
            1,
            sinA * (radius + 4) + cosA * z,
          ],
          rot,
        });
        trees.push({
          pos: [
            cosA * (radius - 4) - sinA * z,
            1,
            sinA * (radius - 4) + cosA * z,
          ],
          rot,
        });
      }
    }
    return trees;
  }, [radius]);
  return (
    <Instances geometry={geometry} material={material} limit={allTrees.length}>
      {allTrees.map((t, i) => (
        <Instance key={i} position={t.pos} rotation={[0, t.rot, 0]} scale={7} />
      ))}
    </Instances>
  );
}
function HexPerimeterRoad({ angle, radius }) {
  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[radius, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, radius * 1.15]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
    </group>
  );
}
function Model({ path, position, scale = 1, rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  return (
    <primitive
      object={clonedScene}
      position={position}
      scale={[scale, scale, scale]}
      rotation={rotation}
    />
  );
}
function SkyLogoI({ position = [0, 140, -80], size = 700 }) {
  const texture = useTexture("/homepage/images/logo.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return (
    <mesh position={position}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.6}
        alphaTest={0.01}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}


// ─────────────────────────────────────────────
// LAYER 2 — mounts after loader hides
// ─────────────────────────────────────────────
function Layer2Scene({
  getCornerPos,
  buildingData,
  resBuildingData,
  solarPanelData,
}) {
  const cp5 = getCornerPos(5),
    cp3 = getCornerPos(3);
  return (
    <>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/circle_water.glb"
          position={[0, -1.1, 0]}
          scale={150}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/ground.glb"
          position={[-20, 5.9, 135]}
          scale={43}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/tower.glb"
          position={[-30, 0, -40]}
          scale={50}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/hospitals.glb"
          position={[17, 12, 132]}
          scale={30}
          rotation={[0, -Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/hospital_2.glb"
          position={[105, 6, 125]}
          scale={20}
          rotation={[0, Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/school1.glb"
          position={[-125, 7, 90]}
          scale={35}
          rotation={[0, Math.PI / 6, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/school_boundary.glb"
          position={[-125, 7, 90]}
          scale={60}
          rotation={[0, -Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/base_army.glb"
          position={[-5, 8, -135]}
          scale={50}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/missiel.glb"
          position={[-110, 21, -135]}
          scale={40}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/helipad_def.glb"
          position={[-109, 6, -100]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/lake.glb"
          position={[35 + cp5[0], 0, -30 + cp5[2]]}
          scale={25}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/photoroom1.glb"
          position={[90 + cp5[0], 2, cp5[2]]}
          scale={28}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/photoroom2.glb"
          position={[40 + cp5[0], 2, -55 + cp5[2]]}
          scale={24}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/farmhouse.glb"
          position={[-60 + cp3[0], -4, -70 + cp3[2]]}
          scale={15}
        />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedBuildings buildings={buildingData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedResBuildings buildings={resBuildingData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedSolarPanels panels={solarPanelData} />
        </group>
      </Suspense>
    </>
  );
}

// ─────────────────────────────────────────────
// LAYER 3 — mounts after loader hides
// ─────────────────────────────────────────────
function Layer3Scene({
  getCornerPos,
  cowsData,
  horsesData,
  sheepData,
  goatsData,
  chickenData,
  carsData,
  roboData,
  bicyclesData,
}) {
  return (
    <>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedCows cows={cowsData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedHorses horses={horsesData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedSheep sheep={sheepData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedGoats goats={goatsData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(3)}>
          <InstancedChickens chickens={chickenData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <InstancedCars cars={carsData} />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <InstancedRobos robos={roboData} />
      </Suspense>
      <Suspense fallback={null}>
        <InstancedBicycles bikes={bicyclesData} />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/helicopter_def.glb"
          position={[-109, 31, -100]}
          scale={30}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/def_veh.glb"
          position={[-75, 9, -130]}
          scale={20}
          rotation={[0, Math.PI / 4, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/helicopter.glb"
          position={[17, 28, 140]}
          scale={20}
          rotation={[-0.2, Math.PI / 6, 0.1]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/ambulance.glb"
          position={[80, 5, 60]}
          scale={15}
          rotation={[0, Math.PI / 3, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/slide.glb"
          position={[-20, 11, 135]}
          scale={15}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/Swings.glb"
          position={[-20, 6, 125]}
          scale={8}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/seesaw.glb"
          position={[-10, 3.5, 130]}
          scale={8}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/cycle_stand.glb"
          position={[-115, 7, 116]}
          scale={20}
          rotation={[0, Math.PI / 6, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <Model
            path="/homepage/models/solarcar.glb"
            position={[4, 5, 50]}
            scale={25}
            rotation={[0, -Math.PI / 2, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/bus.glb"
          position={[-89, 4, -50]}
          scale={15}
          rotation={[0, Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/bike.glb"
          position={[6, 4, 101]}
          scale={10}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/rikshaw.glb"
          position={[-8, 3.5, -102]}
          scale={12}
          rotation={[0, Math.PI, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/scooty.glb"
          position={[-109, 4, 40]}
          scale={8}
          rotation={[0, Math.PI / 5, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/students.glb"
          position={[-100, 9.8, 115]}
          scale={10}
          rotation={[0, Math.PI / 3, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/girls_bench.glb"
          position={[-110, 6, 150]}
          scale={20}
          rotation={[0, Math.PI / 7, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/school_boys.glb"
          position={[-105, 7, 160]}
          scale={20}
          rotation={[0, -Math.PI / 1.2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/boys.glb"
          position={[-28, 6, 125]}
          scale={8}
          rotation={[0, Math.PI / 2, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/bot.glb"
          position={[-90, 7, 100]}
          scale={10}
          rotation={[0, Math.PI / 5, 0]}
        />
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <Model
            path="/homepage/models/AIboard.glb"
            position={[40, 3, -50]}
            scale={18}
            rotation={[0, Math.PI / 6, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <group position={getCornerPos(0)}>
          <Model
            path="/homepage/models/dustbin.glb"
            position={[0, 1, -40]}
            scale={10}
            rotation={[Math.PI / 8, 0, 0]}
          />
        </group>
      </Suspense>
      <Suspense fallback={null}>
        <Model
          path="/homepage/models/plus.glb"
          position={[105, 12, 127]}
          scale={5}
        />
      </Suspense>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
//  TRACKER — sits inside Canvas, watches useProgress.active
//  Calls onDone() the moment active hits 0 after layers mount.
// ─────────────────────────────────────────────────────────────
function LoadTracker({ enabled, onDone }) {
  const { active } = useProgress();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (active === 0 && !firedRef.current) {
      firedRef.current = true;
      // Small grace: let GPU finish uploading last textures
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
  }, [enabled, active, onDone]);

  // Hard fallback — unlock after 45 s no matter what
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => {
      if (!firedRef.current) {
        firedRef.current = true;
        onDone();
      }
    }, 45000);
    return () => clearTimeout(t);
  }, [enabled, onDone]);

  return null;
}

// ─────────────────────────────────────────────
// MAIN CITY COMPONENT
// Props:
//   onSelectDome  — called with dome world-pos (or null)
//   showLayers    — true after loader screen hides → mounts L2+L3
//   domsLocked    — true while city is still loading → blocks dome clicks
// ─────────────────────────────────────────────
export default function City({
  onSelectDome,
  showLayers,
  domsLocked,
  onAllLoaded,
}) {
  const navigate = useNavigate();
  const { scene, gl, camera } = useThree();
  const hexRadius = 110;

  const getCornerPos = useCallback(
    (i) => [
      Math.cos((i * Math.PI) / 3) * hexRadius,
      1,
      Math.sin((i * Math.PI) / 3) * hexRadius,
    ],
    [],
  );

  // ── Data ──
  const mountainData = useMemo(
    () => [
      { position: [150, 0, -245], scale: [600, 250, 150], rotation: [0, 0, 0] },

      {
        position: [-160, 0, -220],
        scale: [600, 250, 150],
        rotation: [0, 0, 0],
      },
      { position: [150, 24, 245], scale: 200, rotation: [0, Math.PI, 0] },
      { position: [-35, 22, 255], scale: 200, rotation: [0, Math.PI, 0] },
      { position: [-190, 18, 220], scale: 200, rotation: [0, Math.PI, 0] },

      {
        position: [320, 15, -15],
        scale: [330, 250, 400],
        rotation: [0, Math.PI, 0],
      },
      { position: [260, 15, 120], scale: 200, rotation: [0, Math.PI, 0] },
      {
        position: [-260, 0, -140],
        scale: [600, 250, 150],
        rotation: [Math.PI / 8, Math.PI / 6, 0],
      },
      { position: [-240, 6, -30], scale: 200, rotation: [0, Math.PI / 2, 0] },
      { position: [-260, 14, 120], scale: 200, rotation: [0, 0, 0] },
    ],
    [],
  );

  const carsData = useMemo(
    () => [
      { position: [42.5, 1, 20], rotation: [0, Math.PI / 2, 0], scale: 12 },
      { position: [42.5, 1, 27], rotation: [0, Math.PI / 2, 0], scale: 12 },
      { position: [30.5, 1, 27], rotation: [0, Math.PI / 2, 0], scale: 12 },
      { position: [30.5, 1, 34], rotation: [0, Math.PI / 2, 0], scale: 12 },
      { position: [42.5, 1, 34], rotation: [0, Math.PI / 2, 0], scale: 12 },
    ],
    [],
  );
  const buildingData = useMemo(
    () => [
      { position: [63, 5, 5], scale: 25, rotation: [0, 0, 0] },
      { position: [63, 5, 25], scale: 25, rotation: [0, 0, 0] },
      { position: [43, 6, 50], scale: 25, rotation: [0, 0, 0] },
      { position: [58, 6, 45], scale: 25, rotation: [0, 0, 0] },
    ],
    [],
  );
  const resBuildingData = useMemo(
    () => [
      { position: [68, 12, -25], scale: 28, rotation: [0, Math.PI / 2, 0] },
      { position: [42, 8, -30], scale: 16, rotation: [0, 0, 0] },
      { position: [27, 8, -35], scale: 16, rotation: [0, 0, 0] },
      { position: [42.5, 8, -10], scale: 16, rotation: [0, Math.PI / 2, 0] },
      { position: [42.5, 8, 7], scale: 16, rotation: [0, Math.PI / 2, 0] },
    ],
    [],
  );
  const cowsData = useMemo(
    () => [
      { position: [-40, 1, -3], scale: 25, rotation: [0, 0.5, 0] },
      { position: [-45, 1, -82], scale: 25, rotation: [0, 1.2, 0] },
      { position: [-55, 1, -84], scale: 25, rotation: [0, -0.8, 0] },
      { position: [-48, 1, -2], scale: 25, rotation: [0, 2.5, 0] },
      { position: [-35, 1, -75], scale: 25, rotation: [0, 0, 0] },
      { position: [-35, 1, -87], scale: 25, rotation: [0, 3.1, 0] },
    ],
    [],
  );
  const goatsData = useMemo(
    () => [
      { position: [-80, 2, 30], scale: 2, rotation: [0, -Math.PI / 6, 0] },
      { position: [-80, 2, 10], scale: 2, rotation: [0, Math.PI / 6, 0] },
    ],
    [],
  );
  const sheepData = useMemo(
    () => [
      { position: [-40, 0, -70], scale: 2.5, rotation: [0, 0, 0] },
      { position: [-50, 0, -70], scale: 2.5, rotation: [0, Math.PI, 0] },
    ],
    [],
  );
  const bicyclesData = useMemo(
    () => [
      { position: [-118, 7, 120], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
      { position: [-115, 7, 118], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
      { position: [-112, 7, 115], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
      { position: [-110, 7, 114], scale: 10, rotation: [0, Math.PI / 0.9, 0] },
    ],
    [],
  );
  const roboData = useMemo(
    () => [
      { position: [5, 7, 120], scale: 8, rotation: [0, 0.2, 0] },
      { position: [120, 3, 125], scale: 7, rotation: [0, -0.6, 0] },
    ],
    [],
  );
  const chickenData = useMemo(
    () => [
      { position: [-40, -0.5, -12], scale: 4, rotation: [0, 1.5, 0] },
      { position: [-48, -0.5, -18], scale: 4, rotation: [0, 1.5, 0] },
      { position: [-41, -0.5, -15], scale: 4, rotation: [0, 1.5, 0] },
      { position: [-43, -0.5, -10], scale: 4, rotation: [0, 0.5, 0] },
      { position: [-41, -0.5, -20], scale: 4, rotation: [0, 5.5, 0] },
      { position: [-45, -0.5, -16], scale: 4, rotation: [0, 4.5, 0] },
      { position: [-48, -0.5, -12], scale: 4, rotation: [0, 1.5, 0] },
    ],
    [],
  );
  const horsesData = useMemo(
    () => [
      { position: [-30, -0.5, 40], scale: 15, rotation: [0, 1.5, 0] },
      { position: [-25, -0.5, 25], scale: 15, rotation: [0, -1.0, 0] },
      { position: [-14, -0.5, 35], scale: 15, rotation: [0, 0.2, 0] },
      { position: [-29, -0.5, 35], scale: 15, rotation: [0, 2.1, 0] },
    ],
    [],
  );
  const solarPanelData = useMemo(
    () => [
      {
        position: [8, 8, 43],
        scale: 12,
        rotation: [Math.PI / 4 + 1, 11.6, 1.8],
      },
      {
        position: [4, 7.9, 57],
        scale: 12,
        rotation: [Math.PI / 4 + 1, 11.5, 1.9],
      },
      { position: [20, 1, -50], scale: 18, rotation: [Math.PI / 8, 0, 0] },
      { position: [10, 9, -131], scale: 8, rotation: [0, Math.PI / 2, 0] },
      { position: [15, 1, -50], scale: 18, rotation: [Math.PI / 8, 0, 0] },
    ],
    [],
  );
  const blueBasesData = useMemo(
    () =>
      [0, 1, 2, 3, 4, 5, 6].map((i) => ({
        position: i === 6 ? [0, 1, 0] : getCornerPos(i),
        rotation: [0, Math.PI / 2, 0],
        scale: 65,
      })),
    [getCornerPos],
  );
  const windmillsData = useMemo(
    () => [
      { position: [20, 4, -35], scale: 10, rotation: [0, 0, 0] },
      { position: [20, 11.8, -155], scale: 20, rotation: [0, -Math.PI / 2, 0] },
    ],
    [],
  );
  const cp3 = useMemo(() => getCornerPos(3), [getCornerPos]);
  const cp5 = useMemo(() => getCornerPos(5), [getCornerPos]);
  const cropsData = useMemo(
    () => [
      {
        position: [-45 + cp3[0], 4, -50 + cp3[2]],
        scale: 35,
        rotation: [0, Math.PI, 0],
      },
      {
        position: [-60 + cp3[0], 4, 20 + cp3[2]],
        scale: 35,
        rotation: [0, Math.PI, 0],
      },
    ],
    [cp3],
  );
  const farmsData = useMemo(
    () => [
      {
        position: [50 + cp5[0], 5, 5 + cp5[2]],
        scale: 40,
        rotation: [0, 0, 0],
      },
      {
        position: [60 + cp5[0], 5, -25 + cp5[2]],
        scale: 30,
        rotation: [0, 0, 0],
      },
    ],
    [cp5],
  );
  const cabinsData = useMemo(
    () => [
      {
        position: [-40 + cp3[0], -3, 60 + cp3[2]],
        scale: 15,
        rotation: [0, Math.PI / 4, 0],
      },
      {
        position: [-8 + cp3[0], -4, -50 + cp3[2]],
        scale: 17,
        rotation: [0, Math.PI, 0],
      },
    ],
    [cp3],
  );
  const treeClusters = useMemo(
    () => [
      { position: [55 + cp5[0], 1, 55 + cp5[2]], count: 20, spread: 12 },
      { position: [-30 + cp5[0], 1, -20 + cp5[2]], count: 30, spread: 12 },
      { position: [cp5[0], 0, cp5[2]], count: 15, spread: 40 },
    ],
    [cp5],
  );

  const [rotatingDome, setRotatingDome] = useState(null);
  const [activeDome, setActiveDome] = useState(null);

  const handleDomeClick = (i, pos) => {
    if (domsLocked) return; // ← locked while banner is showing
    if (activeDome === i) return;
    setActiveDome(i);
    setRotatingDome(i);
    onSelectDome(pos);
  };
  const resetView = () => {
    onSelectDome(null);
    setActiveDome(null);
    setRotatingDome(null);
    document.body.style.cursor = "auto";
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => gl.compile(scene, camera));
    return () => cancelAnimationFrame(id);
  }, [scene, gl, camera]);

  const handleAllLoaded = useCallback(() => {
    onAllLoaded?.(); // This tells Homepage to set phase to "ready"
  }, [onAllLoaded]);
  return (
    <>
      <group>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[50, 100, 50]}
          intensity={1.2}
          color="#ffffff"
        />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.1, 0]}
          onClick={() => {
            if (activeDome !== null) resetView();
          }}
        >
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial color="#0a2b02" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* ── Layer 1 ── */}
        <InstancedMountains mountains={mountainData} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <HexPerimeterRoad
            key={i}
            angle={(i * Math.PI) / 3 + Math.PI / 6}
            radius={hexRadius - 8}
          />
        ))}
        <AllRoadTrees radius={hexRadius - 8} />
        <AllTreeClusters clusters={treeClusters} />
        <InstancedBlueBase bases={blueBasesData} />
        <InstancedWindmills windmills={windmillsData} />
        <InstancedCrops crops={cropsData} />
        <InstancedFarms farms={farmsData} />
        <InstancedCabins cabins={cabinsData} />
        <SkyLogoI position={[0, -200, -2200]} size={90} />

        {/* ── Domes ── */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const pos = i === 6 ? [0, 1, 0] : getCornerPos(i);
          return (
            <group key={i} position={pos}>
              <Dome
                index={i}
                position={[0, 0, 0]}
                iconPath={`/homepage/images/icon_${i}.png`}
                isZoomed={activeDome !== null}
                isSelected={activeDome === i}
                isRotating={rotatingDome === i}
                onRotationComplete={() => setRotatingDome(null)}
                onClick={() => handleDomeClick(i, pos)}
                onBack={resetView}
                onGo={(idx) => {
                  const pages = {
                    0: "/events",
                    1: "/speakers",
                    2: "/teams",
                    3: "/timeline",
                    4: "/aboutus",
                    5: "/sponsors",
                    6: "/initiative",
                  };
                  navigate(pages[idx]);
                }}
              />
            </group>
          );
        })}

        {/* ── Layers 2 & 3 — mount after loader hides, load behind banner ── */}

        <>
          <Layer2Scene
            getCornerPos={getCornerPos}
            buildingData={buildingData}
            resBuildingData={resBuildingData}
            solarPanelData={solarPanelData}
          />
          <Layer3Scene
            getCornerPos={getCornerPos}
            cowsData={cowsData}
            horsesData={horsesData}
            sheepData={sheepData}
            goatsData={goatsData}
            chickenData={chickenData}
            carsData={carsData}
            roboData={roboData}
            bicyclesData={bicyclesData}
          />
          {/* Watches active — calls onAllLoaded when every GLTF is done */}
          <LoadTracker enabled={true} onDone={handleAllLoaded} />
        </>

      </group>
    </>
  );
}
