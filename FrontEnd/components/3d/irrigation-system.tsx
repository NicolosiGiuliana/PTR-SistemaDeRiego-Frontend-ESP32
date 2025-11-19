"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { WaterDrops } from "./water-drops"

interface IrrigationSystemProps {
  position: [number, number, number]
  isActive: boolean
  scale?: number
}

// Componente para un aspersor individual
function Sprinkler({ position, isActive }: { position: [number, number, number], isActive: boolean }) {
  const sprinklerRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (sprinklerRef.current && isActive) {
      sprinklerRef.current.rotation.y += 0.05
    }
  })

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.2, 8]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
      <mesh ref={sprinklerRef} castShadow position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.05, 0.1, 8]} />
        <meshStandardMaterial color="#0088ff" opacity={isActive ? 0.8 : 0.3} transparent />
      </mesh>
    </group>
  )
}

export function IrrigationSystem({ position, isActive, scale = 1 }: IrrigationSystemProps) {
  const [x, y, z] = position

  return (
    <group position={[x, y, z]} scale={[scale, scale, scale]}>
      {/* Tubería principal */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
        <meshStandardMaterial color="#444444" />
      </mesh>

      {/* Aspersores */}
      <Sprinkler position={[-1, 0.5, 0]} isActive={isActive} />
      <Sprinkler position={[0, 0.5, 0]} isActive={isActive} />
      <Sprinkler position={[1, 0.5, 0]} isActive={isActive} />

      {/* Gotas de agua */}
      {isActive && (
        <>
          <WaterDrops position={[-0.1, 0.3, 0]} />
          <WaterDrops position={[0.1, 0.3, 0]} />
        </>
      )}
    </group>
  )
} 