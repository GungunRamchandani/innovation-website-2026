import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import HologramIcon from "./HologramIcon";

const DOME_DATA = {
  0: { title: "Events" },
  1: { title: "Speakers" },
  2: { title: "Team" },
  3: { title: "Timeline" },
  4: { title: "About Us" },
  5: { title: "Sponsors" },
  6: { title: "Initiative" },
};

export default function Dome({
  index,
  position,
  iconPath,
  isRotating,
  isZoomed,
  isSelected,
  onClick,
  onRotationComplete,
  onBack,
  onGo,
}) {
  const meshRef = useRef();
  const textRef = useRef();
  const signpostRef = useRef();
  const [targetRotation, setTargetRotation] = useState(0);

  // 1. LABEL TEXTURE LOGIC (The Ribbon)
  const labelTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text Styling
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#00d4ff";
    ctx.font = "bold 80px Arial";

    const title = DOME_DATA[index]?.title?.toUpperCase() || "DOME";
    ctx.fillText(title, 512, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.repeat.set(3, 1); // Repeats text 3 times around the cylinder
    texture.needsUpdate = true;
    return texture;
  }, [index]);

  // --- UPDATED ANIMATION LOGIC ---
  useFrame((state, delta) => {
    // A. Handle 360-degree spin
    if (isRotating && meshRef.current) {
      if (meshRef.current.rotation.y < targetRotation) {
        meshRef.current.rotation.y += delta * 6;
      } else {
        meshRef.current.rotation.y = targetRotation;
        onRotationComplete();
      }
    }

    // B. Handle Text Position and Rotation
    if (textRef.current) {
      if (isSelected && !isRotating) {
        // SELECTED VIEW: Center position and face camera
        textRef.current.position.set(0, 5, 0);
        textRef.current.lookAt(state.camera.position);
      } else {
        // MAIN VIEW or WHILE ROTATING: Offset position and flat/static
        textRef.current.position.set(0, 5, -12);
        textRef.current.rotation.set(-Math.PI / 2 + 5, 0, Math.PI);
      }
    }

    // C. Signpost Billboarding
    if (isSelected && signpostRef.current) {
      signpostRef.current.lookAt(state.camera.position);
    }
  });

  // Reset target rotation when isRotating triggers
  useEffect(() => {
    if (isRotating && meshRef.current) {
      setTargetRotation(meshRef.current.rotation.y + Math.PI * 2);
    }
  }, [isRotating]);

  // 3. SIGNPOST CONFIGURATION
  const showSignpost = isSelected && !isRotating & isZoomed;

  // Local offset relative to dome center [0,0,0]
  // x: -22 (Left of road), z: 25 (In front of dome)
  const localSignpostPos = [-32, 0, 25];

  return (
    <group position={position}>
      {/* THE ROTATING DOME GROUP */}
      <group ref={meshRef}>
        {/* PUT THE HOLOGRAM ICON HERE */}
        <HologramIcon texturePath={iconPath} isSelected={isSelected} />
        <Text
          ref={textRef}
          position={[0, 4, -12]} // Slightly above 0 to avoid "z-fighting" with the floor
          //rotation={[-Math.PI / 2 + 5, 0, Math.PI / 2]} // Rotate -90 degrees on X to lay flat
          fontSize={4} // Adjust size as needed
          color="#00d4ff" // Matching your neon blue theme
          font="/homepage/fonts/Orbitron-Bold.ttf" // Optional: path to a custom font
          anchorX="center"
          anchorY="middle"
          maxWidth={40}
          textAlign="center"
        >
          {DOME_DATA[index]?.title?.toUpperCase()}
        </Text>

        {/* GLASS SHELL */}
        <mesh
          onPointerOver={(e) => {
            // Only show pointer cursor if this dome is NOT yet selected
            if (!isSelected) {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }
          }}
          onPointerOut={() => (document.body.style.cursor = "auto")}
          onClick={(e) => {
            if (!isSelected) {
              // SCENARIO: Zooming In
              // 1. Stop the click from reaching the floor
              e.stopPropagation();
              // 2. Trigger the zoom
              onClick();
            } else {
              // SCENARIO: Already Inside
              // Do NOT call e.stopPropagation().
              // This allows the click to pass through the mesh and hit the Floor mesh.
              console.log("Click passing through dome to floor...");
            }
          }}
        >
          <sphereGeometry args={[30, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={1.5}
            roughness={0}
            color="#3a6989"
            transparent
            opacity={0.6}
            depthWrite={false}
          />
        </mesh>

        {/* PERMANENT RIBBON (BELT) */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[30.6, 30.6, 7, 64, 1, true]} />
          <meshBasicMaterial
            map={labelTexture}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-10}
          />
        </mesh>
      </group>

      {/* THE WAYFINDING SIGNPOST (UI) */}
      {showSignpost && (
        <group position={localSignpostPos} ref={signpostRef}>
          {/* Main Support Pillar */}
          <mesh position={[0, 10, 0]}>
            <boxGeometry args={[1, 20, 1]} />
            <meshStandardMaterial color="#222222" metalness={0.8} />
          </mesh>

          {/* BACK BUTTON SCREEN */}
          <group
            position={[-5, 16, 0]}
            onClick={(e) => {
              e.stopPropagation(); // Prevent floor click
              onBack(); // Reset view
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh>
              <planeGeometry args={[9, 4]} />
              <meshBasicMaterial
                color="#ff3333"
                transparent
                opacity={0.5}
                depthTest={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Text
              position={[0, 0, 0.1]}
              fontSize={1.2}
              color="#ffffff"
              fontWeight="bold"
              depthTest={false}
              renderOrder={11}
            >
              {"< CITY"}
            </Text>
          </group>

          {/* ENTER BUTTON SCREEN */}
          <group
            position={[5, 13, 0]}
            onClick={(e) => {
              e.stopPropagation(); // 1. STOP the click from hitting the floor
              console.log("Navigation triggered");
              onGo(index);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "auto")}
          >
            <mesh>
              <planeGeometry args={[10, 5]} />{" "}
              {/* Made slightly larger for easier clicking */}
              <meshBasicMaterial
                color="#00ffcc"
                transparent
                opacity={0.7}
                depthTest={false}
                side={THREE.DoubleSide}
              />
            </mesh>
            <Text
              position={[0, 0, 0.5]}
              fontSize={1.5}
              color="#000000"
              fontWeight="bold"
              depthTest={false}
              renderOrder={11}
            >
              {"ENTER >"}
            </Text>
          </group>
        </group>
      )}
    </group>
  );
}
