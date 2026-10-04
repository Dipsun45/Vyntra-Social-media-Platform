import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial } from '@react-three/drei';

const FloatingSphere = ({ position, color, speed = 1.5, factor = 0.6 }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshWobbleMaterial color={color} speed={speed} factor={factor} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
};

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ preserveDrawingBuffer: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false }}
        onCreated={({ gl }) => {
          gl.domElement?.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} color="#8b5cf6" intensity={2} />
        
        <FloatingSphere position={[-4, 2, -2]} color="#8b5cf6" speed={2} />
        <FloatingSphere position={[4, -3, -1]} color="#06b6d4" speed={1.5} />
        <FloatingSphere position={[3, 3, -3]} color="#ec4899" speed={1.8} />
        <FloatingSphere position={[-3, -2, -4]} color="#6366f1" speed={2.5} />
      </Canvas>
    </div>
  );
}
