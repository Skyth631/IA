import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

// Enhanced visual configurations
const PARTICLE_COUNT = 8000; // Increased for more density
const PARTICLE_RADIUS = 2.0; // Increased for wider spread
const ROTATION_SPEED = {
  x: 0.15,
  y: 0.1
};

const SPHERE_CONFIG = {
  large: {
    args: [0.4, 32, 32] as [number, number, number],
    position: [-1.2, 0, 0] as [number, number, number],
    color: "#76ABAE"
  },
  small: {
    args: [0.3, 24, 24] as [number, number, number],
    position: [1.2, 0, 0] as [number, number, number],
    color: "#EEEEEE"
  }
} as const;

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { camera } = useThree();
  
  // Enhanced particle positions
  const positions = useMemo(() => 
    random.inSphere(new Float32Array(PARTICLE_COUNT), { radius: PARTICLE_RADIUS }) as Float32Array,
    []
  );

  // More dynamic animation
  const animate = useCallback((state: { clock: { elapsedTime: number } }) => {
    if (!ref.current) return;
    const time = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(time * 0.2) * ROTATION_SPEED.x;
    ref.current.rotation.y = Math.cos(time * 0.1) * ROTATION_SPEED.y;
    ref.current.rotation.z = Math.sin(time * 0.15) * 0.1;
  }, []);

  useFrame(animate);

  // Set initial camera position
  useEffect(() => {
    camera.position.z = 4;
  }, [camera]);

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
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

const FloatingSpheres = React.memo(function FloatingSpheres() {
  const sphere1 = useRef<THREE.Mesh>(null!);
  const sphere2 = useRef<THREE.Mesh>(null!);

  const animate = useCallback((state: { clock: { elapsedTime: number } }) => {
    if (!sphere1.current || !sphere2.current) return;
    const time = state.clock.elapsedTime;
    
    // Enhanced movement
    sphere1.current.position.y = Math.sin(time * 0.5) * 0.3;
    sphere2.current.position.y = Math.cos(time * 0.5) * 0.3;
    
    sphere1.current.rotation.x = time * 0.3;
    sphere1.current.rotation.y = time * 0.2;
    sphere2.current.rotation.z = time * 0.3;
    sphere2.current.rotation.x = time * 0.2;
  }, []);

  useFrame(animate);

  return (
    <>
      <Sphere ref={sphere1} args={SPHERE_CONFIG.large.args} position={SPHERE_CONFIG.large.position}>
        <meshPhongMaterial
          color={SPHERE_CONFIG.large.color}
          wireframe
          transparent
          opacity={0.4}
          emissive={SPHERE_CONFIG.large.color}
          emissiveIntensity={0.2}
        />
      </Sphere>
      <Sphere ref={sphere2} args={SPHERE_CONFIG.small.args} position={SPHERE_CONFIG.small.position}>
        <meshPhongMaterial
          color={SPHERE_CONFIG.small.color}
          wireframe
          transparent
          opacity={0.4}
          emissive={SPHERE_CONFIG.small.color}
          emissiveIntensity={0.2}
        />
      </Sphere>
    </>
  );
});

export default React.memo(function Background3D() {
  const cameraProps = useMemo(() => ({ 
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [0, 0, 4] as [number, number, number]
  }), []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#222831]">
      <Canvas 
        camera={cameraProps} 
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
        }}
      >
        <color attach="background" args={['#222831']} />
        <fog attach="fog" args={['#222831', 3, 10]} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ParticleField />
        <FloatingSpheres />
      </Canvas>
    </div>
  );
}); 