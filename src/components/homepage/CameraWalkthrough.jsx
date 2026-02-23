import { useThree, useFrame } from "@react-three/fiber"
import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

export default function CameraWalkthrough({ target, active }) {
    const { camera } = useThree()
    const t = useRef(0)
    const [isInitial, setIsInitial] = useState(true)

    const desiredPos = useRef(new THREE.Vector3())
    const lookAtPos = useRef(new THREE.Vector3())

    useEffect(() => {
        // Reset the timeline whenever the focus target changes
        t.current = 0
        camera.near = 0.1
        camera.far = 3000
        camera.updateProjectionMatrix()
    }, [target, active, isInitial])

    // ===== 🎚 CINEMATIC TUNING =====
    const introRadius = 290
    const introHeight = 130
    const endPointAngle = 3 * Math.PI / 2 // This is your "Reset" position

    const startRadius = 80
    const endRadius = 70
    const baseHeight = 40
    const endHeight = 50

    const speed = 0.007
    const posLerp = 0.085
    const lookLerp = 0.12
    const ease = (x) => x * x * (3 - 2 * x)

    useFrame(() => {
        // 1. INITIAL FULL MAP ORBIT (Runs once on load)
        /*if (isInitial) {
            t.current = Math.min(t.current + speed, 100);
            const e = ease(t.current);
            const angle = endPointAngle + (e * Math.PI * 2);

            desiredPos.current.set(
                Math.cos(angle) * introRadius,
                introHeight,
                Math.sin(angle) * introRadius
            );

            camera.position.lerp(desiredPos.current, posLerp);
            camera.lookAt(0, 0, 0);

            if (t.current >= 1) {
                setIsInitial(false);
                t.current = 0;
            }
            return;
        }*/

        // 2. ZOOMED OUT / RESET VIEW (When clicking outside a dome)
        if (!active || !target) {
            // Move camera back to the wide "Hero View" endpoint
            desiredPos.current.set(
                Math.cos(endPointAngle) * introRadius,
                introHeight,
                Math.sin(endPointAngle) * introRadius
            );

            camera.position.lerp(desiredPos.current, 0.05); // Smoothly return to overview

            // Look back at the center of the hex city
            lookAtPos.current.set(0, 0, 0);
            camera.lookAt(camera.position.clone().lerp(lookAtPos.current, 0.05));
            return;
        }

        // 3. STANDARD DOME WALKTHROUGH (When a dome is active)
        t.current = Math.min(t.current + 0.004, 1);
        const e = ease(t.current);

        const radius = THREE.MathUtils.lerp(startRadius, endRadius, e);
        const angle = (Math.PI / 2 - (Math.PI * 0.22)) + (Math.PI * 2 * e);
        const height = THREE.MathUtils.lerp(baseHeight, endHeight, ease(Math.max(0, (e - 0.65) / 0.35)));

        desiredPos.current.set(
            target[0] + Math.cos(angle) * radius,
            target[1] + height,
            target[2] + Math.sin(angle) * radius
        );

        camera.position.lerp(desiredPos.current, posLerp);

        lookAtPos.current.set(target[0], target[1] + 1.2, target[2]);
        camera.lookAt(camera.position.clone().lerp(lookAtPos.current, lookLerp));
    })

    return null
}