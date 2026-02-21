import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function WaveMesh() {
  const meshRef = useRef(null);

  const geometry = useMemo(() => new THREE.PlaneGeometry(15, 15, 64, 64), []);

  const originalPositions = useMemo(() => {
    return geometry.attributes.position.array.slice();
  }, [geometry]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;
    const array = positions.array;

    for (let i = 0; i < array.length; i += 3) {
      const x = originalPositions[i];
      const y = originalPositions[i + 1];

      const z =
        Math.sin(x * 0.8 + time * 0.5) * 0.5 +
        Math.sin(y * 0.6 + time * 0.4) * 0.5 +
        Math.sin((x + y) * 0.4 + time * 0.8) * 0.3;

      array[i + 2] = z;
    }

    positions.needsUpdate = true;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, -5]}>
      <meshStandardMaterial
        color="#0FB9B1"
        wireframe
        transparent
        opacity={0.15}
        emissive="#0FB9B1"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

function Stars() {
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return pos;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#0FB9B1" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function WaveBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-background/50 pointer-events-none">
      <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#0FB9B1" />
        <WaveMesh />
        <Stars />
        <fog attach="fog" args={['#040a12', 5, 20]} />
      </Canvas>
    </div>
  );
}
