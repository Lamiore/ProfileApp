/* eslint-disable react/no-unknown-property */
'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ContactShadows, OrbitControls, Center } from '@react-three/drei';
import * as THREE from 'three';

function KeyboardModel() {
    const { scene } = useGLTF('/models/about/minikeyboard.gltf');
    const cloned = useMemo(() => scene.clone(true), [scene]);
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!ref.current) return;
        // Subtle floating only
        ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
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
            camera={{ position: [0, 2, 8], fov: 45 }}
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
            <OrbitControls enableZoom={false} autoRotate={false} />
        </Canvas>
    );
}
