/* eslint-disable react/no-unknown-property */
'use client';

import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

// module-level flag — safe since this component is client-only (ssr: false)
let _menuOpen = false;
window.addEventListener('menu:open', () => { _menuOpen = true; });
window.addEventListener('menu:close', () => { _menuOpen = false; });

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
        if (!ref.current || _menuOpen) return;
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
        </Canvas>
    );
}
