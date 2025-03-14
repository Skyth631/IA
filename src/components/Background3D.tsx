import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  useFrame((state) => {
    ref.current.rotation.x = state.clock.elapsedTime * 0.1;
    ref.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={random.inSphere(new Float32Array(5000), { radius: 1.5 })}
        stride={3}
        frustumCulled={false}
      >
        <PointMaterial
          transparent
          color="#76ABAE"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function FloatingSpheres() {
  const sphere1 = useRef<THREE.Mesh>(null!);
  const sphere2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    sphere1.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    sphere2.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.2;
    
    sphere1.current.rotation.x = state.clock.elapsedTime * 0.2;
    sphere2.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  return (
    <>
      <Sphere ref={sphere1} args={[0.3, 32, 32]} position={[-1, 0, 0]}>
        <meshPhongMaterial
          color="#222831"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
      <Sphere ref={sphere2} args={[0.2, 24, 24]} position={[1, 0, 0]}>
        <meshPhongMaterial
          color="#EEEEEE"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
    </>
  );
}

export default function Background3D() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#222831]">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ParticleField />
        <FloatingSpheres />
      </Canvas>
    </div>
  );
} 