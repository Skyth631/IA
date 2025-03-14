import React, { useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

// Memoize static values
const PARTICLE_COUNT = 5000;
const PARTICLE_RADIUS = 1.5;
const ROTATION_SPEED = {
  x: 0.1,
  y: 0.05
};

const SPHERE_CONFIG = {
  large: {
    args: [0.3, 32, 32] as [number, number, number],
    position: [-1, 0, 0] as [number, number, number],
    color: "#222831"
  },
  small: {
    args: [0.2, 24, 24] as [number, number, number],
    position: [1, 0, 0] as [number, number, number],
    color: "#EEEEEE"
  }
} as const;

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  // Memoize particle positions
  const positions = useMemo(() => 
    random.inSphere(new Float32Array(PARTICLE_COUNT), { radius: PARTICLE_RADIUS }) as Float32Array,
    []
  );

  // Optimize animation callback
  const animate = useCallback((state: { clock: { elapsedTime: number } }) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * ROTATION_SPEED.x;
    ref.current.rotation.y = state.clock.elapsedTime * ROTATION_SPEED.y;
  }, []);

  useFrame(animate);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
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

// Memoize FloatingSpheres component
const FloatingSpheres = React.memo(function FloatingSpheres() {
  const sphere1 = useRef<THREE.Mesh>(null!);
  const sphere2 = useRef<THREE.Mesh>(null!);

  const animate = useCallback((state: { clock: { elapsedTime: number } }) => {
    if (!sphere1.current || !sphere2.current) return;
    const time = state.clock.elapsedTime;
    
    sphere1.current.position.y = Math.sin(time * 0.5) * 0.2;
    sphere2.current.position.y = Math.cos(time * 0.5) * 0.2;
    
    sphere1.current.rotation.x = time * 0.2;
    sphere2.current.rotation.z = time * 0.2;
  }, []);

  useFrame(animate);

  return (
    <>
      <Sphere ref={sphere1} args={SPHERE_CONFIG.large.args} position={SPHERE_CONFIG.large.position}>
        <meshPhongMaterial
          color={SPHERE_CONFIG.large.color}
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
      <Sphere ref={sphere2} args={SPHERE_CONFIG.small.args} position={SPHERE_CONFIG.small.position}>
        <meshPhongMaterial
          color={SPHERE_CONFIG.small.color}
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
    </>
  );
});

// Memoize the entire Background3D component
export default React.memo(function Background3D() {
  // Memoize camera position
  const cameraProps = useMemo(() => ({ position: [0, 0, 3] as [number, number, number] }), []);
  const lightPosition = useMemo(() => [10, 10, 10] as [number, number, number], []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#222831]">
      <Canvas camera={cameraProps} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={lightPosition} />
        <ParticleField />
        <FloatingSpheres />
      </Canvas>
    </div>
  );
}); 