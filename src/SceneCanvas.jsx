import { Canvas } from "@react-three/fiber";
import { Suspense, memo, useState } from "react";
import { Environment, Stars, OrbitControls } from "@react-three/drei";
import City from "./components/homepage/City";
import CameraWalkthrough from "./components/homepage/CameraWalkthrough";

const SceneCanvas = memo(function SceneCanvas({ phase, setPhase }) {
  const [selectedPos, setSelectedPos] = useState(null);

  const domsLocked = phase !== "ready";
  const showLayers = phase !== "loader";

  return (
    <Canvas
      gl={{ powerPreference: "high-performance", antialias: true }}
      camera={{ position: [0, 70, 230], fov: 45, near: 0.1, far: 5000 }}
    >
      <color attach="background" args={["#010407"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
      <Environment preset="night" />

      <Suspense fallback={null}>
        <Stars radius={300} depth={50} count={15000} factor={8} fade speed={2.5} />

        <City
          onSelectDome={setSelectedPos}
          showLayers={showLayers}
          domsLocked={domsLocked}
          onAllLoaded={() => setPhase("ready")}
        />

        <CameraWalkthrough
          target={selectedPos}
          active={Boolean(selectedPos)}
        />
      </Suspense>

      <OrbitControls
        makeDefault
        enableDamping
        enabled={!selectedPos}
        maxPolarAngle={Math.PI / 2.1}
        maxDistance={1000}
      />
    </Canvas>
  );
});

export default SceneCanvas;