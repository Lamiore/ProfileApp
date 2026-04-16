/* eslint-disable react/no-unknown-property */
'use client';

import { Suspense, useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

function KeyboardModel() {
    const { scene } = useGLTF('/models/about/minikeyboard.gltf');
    const cloned = useMemo(() => scene.clone(true), [scene]);
    const ref = useRef<THREE.Group>(null);
    const [scrollY, setScrollY] = useState(0);
    const smoothScroll = useRef(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        if (!ref.current) return;
        // Smooth lerp scroll value
        smoothScroll.current += (scrollY - smoothScroll.current) * 0.05;
        const scrollFactor = smoothScroll.current * 0.002;

        // Floating + scroll-based rotation
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
        ref.current.rotation.set(0.2 + scrollFactor * 0.3, scrollFactor, 0);
    });

    return (
        <group ref={ref} scale={3} rotation={[0.2, 0, 0]}>
            <Center>
                <primitive object={cloned} />
            </Center>
        </group>
    );
}

const DEFAULT_POSITION = new THREE.Vector3(4, 2, 8);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

function AutoResetOrbitControls() {
    const controlsRef = useRef<any>(null);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isResetting = useRef(false);
    const { camera } = useThree();

    const scheduleReset = useCallback(() => {
        if (idleTimer.current) clearTimeout(idleTimer.current);
        isResetting.current = false;
        idleTimer.current = setTimeout(() => {
            isResetting.current = true;
        }, 1500);
    }, []);

    useFrame(() => {
        if (!controlsRef.current || !isResetting.current) return;

        camera.position.lerp(DEFAULT_POSITION, 0.03);
        controlsRef.current.target.lerp(DEFAULT_TARGET, 0.03);
        controlsRef.current.update();

        if (camera.position.distanceTo(DEFAULT_POSITION) < 0.01) {
            camera.position.copy(DEFAULT_POSITION);
            controlsRef.current.target.copy(DEFAULT_TARGET);
            controlsRef.current.update();
            isResetting.current = false;
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            autoRotate={false}
            onStart={scheduleReset}
            onEnd={scheduleReset}
        />
    );
}

export default function Keyboard() {
    return (
        <Canvas
            camera={{ position: [4, 2, 8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ alpha: true, antialias: true }}
            style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={3} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#4466ff" />
            
            <Suspense fallback={<mesh><boxGeometry /><meshStandardMaterial color="hotpink" /></mesh>}>
                <KeyboardModel />
                <ContactShadows
                    position={[0, -2, 0]}
                    opacity={0.4}
                    scale={15}
                    blur={2.5}
                    far={4}
                />
                <Environment preset="city" />
            </Suspense>
            <AutoResetOrbitControls />
        </Canvas>
    );
}
