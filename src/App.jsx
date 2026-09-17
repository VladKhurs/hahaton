import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useFBX, useAnimations, Html } from '@react-three/drei';
import * as THREE from 'three';

// 1. Персонаж из твоего FBX
function Interlocutor() {
  const fbx = useFBX('/Sitting Idle.fbx');
  const { actions } = useAnimations(fbx.animations, fbx);

  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      firstAction?.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return (
    <primitive 
      object={fbx} 
      scale={0.009} 
      position={[0, -0.65, -1.3]} 
      rotation={[0, 0, 0]} 
    />
  );
}

// 2. Движение головой сидя за столом
function HeadControls() {
  useFrame((state) => {
    const maxHorizontal = Math.PI / 4; // ~45 градусов
    const maxVertical = Math.PI / 8;   // ~22 градуса

    const targetY = -state.pointer.x * maxHorizontal;
    const targetX = state.pointer.y * maxVertical;

    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, targetY, 0.05);
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, targetX, 0.05);
  });

  return null;
}

// 3. Светлый офис и деревянный стол
function OfficeRoom() {
  return (
    <group position={[0, -0.7, -0.7]}>
      {/* СТОЛЕШНИЦА (Цвет натурального дерева/дуба) */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 0.05, 0.85]} />
        <meshStandardMaterial color="#a77044" roughness={0.35} />
      </mesh>

      {/* Металлические ножки стола (черный лофт) */}
      <mesh position={[-0.72, 0.28, 0.35]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
      <mesh position={[0.72, 0.28, 0.35]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
      <mesh position={[-0.72, 0.28, -0.35]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
      <mesh position={[0.72, 0.28, -0.35]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>

      {/* СВЕТЛЫЙ ПОЛ ОФИСА (ламинат) */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#d4cdc5" roughness={0.6} />
      </mesh>

      {/* ЗАДНЯЯ СТЕНА ОФИСА (за спиной собеседника) */}
      <mesh position={[0, 1.8, -2.5]}>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>

      {/* Плинтус на стене */}
      <mesh position={[0, 0.05, -2.48]}>
        <boxGeometry args={[20, 0.1, 0.02]} />
        <meshStandardMaterial color="#8a5a36" />
      </mesh>
    </group>
  );
}

// 4. Главный компонент
export default function App() {
  const [choice, setChoice] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#f3f4f6', overflow: 'hidden' }}>
      
      <Canvas 
        camera={{ position: [0, 0.2, 0.1], fov: 55 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* ЯРКИЙ ДНЕВНОЙ СВЕТ */}
        <ambientLight intensity={1.1} />
        {/* Солнечный/оконный свет справа-сверху */}
        <directionalLight position={[4, 5, 3]} intensity={1.5} />
        {/* Мягкая подсветка стола */}
        <pointLight position={[0, 0.8, -0.3]} intensity={0.8} color="#fff6e8" />

        <HeadControls />
        <OfficeRoom />

        <Suspense fallback={<Html center><div style={{ color: '#333', fontFamily: 'sans-serif' }}>Загрузка...</div></Html>}>
          <Interlocutor />
        </Suspense>
      </Canvas>

      {/* КНОПКИ ДЕЙСТВИЙ */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '15px',
        zIndex: 10
      }}>
        <button style={btnStyle} onClick={() => setChoice('Поздороваться')}>👋 Поздороваться</button>
        <button style={btnStyle} onClick={() => setChoice('Положить резюме')}>📄 Положить резюме</button>
        <button style={btnStyle} onClick={() => setChoice('Задать вопрос')}>❓ Задать вопрос</button>
      </div>

      {choice && (
        <div style={{
          position: 'absolute',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1f2937',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '10px',
          fontFamily: 'sans-serif',
          fontSize: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
        }}>
          Вы выбрали: <b style={{ color: '#60a5fa' }}>{choice}</b>
        </div>
      )}

    </div>
  );
}

// Стили кнопок под светлую тему (темное стекло)
const btnStyle = {
  background: 'rgba(31, 41, 55, 0.85)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#fff',
  padding: '13px 22px',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '500',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.1s ease',
};