import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export default function HologramIcon({ texturePath, isSelected }) {
    const texture = useTexture(texturePath);
    const spriteRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (spriteRef.current) {
            spriteRef.current.position.y = 14.3 + Math.sin(time * 1.5) * 1.5;

            const s = isSelected ? 25 : 30 + Math.sin(time * 2) * 0.5;
            spriteRef.current.scale.set(s, s, 1);
        }
    });

    return (
        <sprite ref={spriteRef} position={[0, 14.3, 0]}>
            <spriteMaterial
                map={texture}
                transparent={true}
                alphaTest={0.01}
                blending={THREE.AdditiveBlending}
                color={isSelected ? "#ffffff" : "#00d4ff"}
                opacity={1.5}
                depthWrite={false}
            />
        </sprite>
    );
}