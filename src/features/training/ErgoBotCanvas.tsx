import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Shared material instantiations outside render cycle to avoid GC thrashing
const botMaterial = new THREE.MeshStandardMaterial({
    color: "#F9A825",
    roughness: 0.3,
    metalness: 0.8
});
const botJointMaterial = new THREE.MeshStandardMaterial({
    color: "#003D5C",
    roughness: 0.5,
    metalness: 0.5
});

const ErgoBot = ({ isPlaying }: { isPlaying: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const leftArmRef = useRef<THREE.Group>(null);
    const rightArmRef = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (!isPlaying || !leftArmRef.current || !rightArmRef.current || !headRef.current) {
            if (groupRef.current) groupRef.current.position.y = Math.sin(clock.elapsedTime) * 0.1;
            return;
        }

        const t = clock.elapsedTime * 2;
        leftArmRef.current.rotation.z = Math.sin(t) * 1.5 + 0.5;
        rightArmRef.current.rotation.z = -(Math.sin(t) * 1.5 + 0.5);
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1, 0]}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <mesh ref={headRef} position={[0, 1.8, 0]} material={botMaterial}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                </mesh>
                <mesh position={[0, 1.25, 0]} material={botJointMaterial}>
                    <cylinderGeometry args={[0.15, 0.15, 0.5]} />
                </mesh>
                <mesh position={[0, 0.5, 0]} material={botMaterial}>
                    <cylinderGeometry args={[0.4, 0.3, 1.5, 16]} />
                </mesh>
                <group ref={leftArmRef} position={[0.5, 1.1, 0]}>
                    <mesh material={botJointMaterial}>
                        <sphereGeometry args={[0.2]} />
                    </mesh>
                    <mesh position={[0.1, -0.6, 0]} material={botMaterial} rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
                    </mesh>
                </group>
                <group ref={rightArmRef} position={[-0.5, 1.1, 0]}>
                    <mesh material={botJointMaterial}>
                        <sphereGeometry args={[0.2]} />
                    </mesh>
                    <mesh position={[-0.1, -0.6, 0]} material={botMaterial} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.12, 1.2, 4, 8]} />
                    </mesh>
                </group>
            </Float>
        </group>
    );
};

export const ErgoBotCanvas = ({ isPlaying }: { isPlaying: boolean }) => {
    // Animate only while the lesson is playing; "demand" without invalidate() froze the robot
    return (
        <Canvas frameloop={isPlaying ? 'always' : 'demand'} camera={{ position: [0, 1, 5] }}>
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#F9A825" />
            <pointLight position={[-10, 5, -10]} intensity={2} color="#003D5C" />
            <ErgoBot isPlaying={isPlaying} />
        </Canvas>
    );
};

export default ErgoBotCanvas;
