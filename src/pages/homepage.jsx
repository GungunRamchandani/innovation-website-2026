import { Canvas } from "@react-three/fiber";
import { useState, Suspense, useEffect } from "react";
import City, {
  CityLoaderScreen,
  CityLoadingBanner,
} from "../components/homepage/City";
import CameraWalkthrough from "../components/homepage/CameraWalkthrough";
import { OrbitControls, Environment, Stars, useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import MobileHome from "../components/homepage/MobileHome";

useGLTF.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
);

function ScenePrecompiler() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    gl.compile(scene, camera);
  }, []);
  return null;
}

export default function Homepage({ isAnimationDone }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedPos, setSelectedPos] = useState(null);
  const [phase, setPhase] = useState("waiting");

  useEffect(() => {
    // If animation is done and we are still waiting, show the loader
    if (isAnimationDone && phase === "waiting") {
      setPhase("loader");
    }
  }, [isAnimationDone, phase]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const domsLocked = phase !== "ready";
  const showLayers = true


  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        position: "relative",
      }}
    >
      {isMobile ? (
        <MobileHome />
      ) : (
        <>
          {/* Loader */}

          {/* Only render the loader if we aren't in the 'ready' phase */}
          {phase !== "ready" && (
            <CityLoaderScreen allDone={phase === "ready"} />
          )}

          {/* 3D Canvas */}
          <Canvas
            gl={{ powerPreference: "high-performance", antialias: true }}
            camera={{
              position: [0, 70, 230],
              fov: 45,
              near: 0.1,
              far: 5000,
            }}
          >
            <ScenePrecompiler />
            <color attach="background" args={["#010407"]} />
            <ambientLight intensity={0.8} />
            <directionalLight
              position={[10, 20, 10]}
              intensity={1.5}
              castShadow
            />
            <Environment preset="night" />

            <Suspense fallback={null}>
              <Stars
                radius={300}
                depth={50}
                count={15000}
                factor={8}
                saturation={10}
                fade
                speed={2.5}
              />

              <City
                onSelectDome={(pos) => setSelectedPos(pos)}
                showLayers={showLayers}
                domsLocked={phase !== "ready"}
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
              maxDistance={500}
            />
          </Canvas>
        </>
      )}
    </div>
  );
}
