'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({
  position,
  geometry,
  color,
  speed = 1,
  distortion = 0.3,
  scale = 1,
}: {
  position: [number, number, number];
  geometry: 'icosahedron' | 'torus' | 'sphere' | 'octahedron';
  color: string;
  speed?: number;
  distortion?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  const geo = useMemo(() => {
    switch (geometry) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 1]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case 'sphere':
        return <sphereGeometry args={[1, 16, 16]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
    }
  }, [geometry]);

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geo}
        <MeshDistortMaterial
          color={color}
          wireframe
          transparent
          opacity={0.15}
          distort={distortion}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 300 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      col[i * 3] = 0.4;
      col[i * 3 + 1] = 0.6;
      col[i * 3 + 2] = 0.5;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02;
      points.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#8FB7A6" />
      <pointLight position={[5, -3, 3]} intensity={0.2} color="#B8A9C9" />

      <FloatingShape position={[-4, 2, -2]} geometry="icosahedron" color="#8FB7A6" speed={1.2} distortion={0.4} scale={0.8} />
      <FloatingShape position={[3.5, 1.5, -3]} geometry="torus" color="#B8A9C9" speed={0.8} distortion={0.2} scale={0.6} />
      <FloatingShape position={[-2.5, -2, -1]} geometry="sphere" color="#87CEEB" speed={1.5} distortion={0.3} scale={0.5} />
      <FloatingShape position={[4, -1.5, -2]} geometry="octahedron" color="#D4B896" speed={1} distortion={0.35} scale={0.7} />
      <FloatingShape position={[-1, 3, -4]} geometry="icosahedron" color="#E8B4B8" speed={0.9} distortion={0.25} scale={0.6} />
      <FloatingShape position={[1.5, -3, -3]} geometry="torus" color="#8FB7A6" speed={1.3} distortion={0.2} scale={0.5} />
      <FloatingShape position={[-3.5, -0.5, -2]} geometry="octahedron" color="#87CEEB" speed={1.1} distortion={0.3} scale={0.55} />

      <Particles count={300} />
    </Canvas>
  );
}
