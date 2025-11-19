import React, { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type WaterDropsProps = {
  count?: number
  position: [number, number, number]
}

type DropData = {
  mesh: THREE.Mesh | null
  velocity: THREE.Vector3
  origin: THREE.Vector3
}

export const WaterDrops = ({ count = 30, position }: WaterDropsProps) => {
  const drops = useRef<DropData[]>([])

  // Inicializamos las gotas con posiciones y velocidades aleatorias
  const initialDrops = useMemo(() => {
    const newDrops: DropData[] = []
    for (let i = 0; i < count; i++) {
      const origin = new THREE.Vector3(
        position[0] + (Math.random() - 0.5) * 1.5,
        position[1],
        position[2] + (Math.random() - 0.5) * 1.5
      )

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.01, // dispersión horizontal (X)
        -0.03 - Math.random() * 0.02, // caída vertical (Y)
        (Math.random() - 0.5) * 0.01 // dispersión en profundidad (Z)
      )

      newDrops.push({ mesh: null, velocity, origin })
    }
    return newDrops
  }, [count, position])

  // useFrame para animar las gotas
  useFrame(() => {
    for (let i = 0; i < initialDrops.length; i++) {
      const dropData = drops.current[i]
      if (!dropData || !dropData.mesh) continue

      const { mesh, velocity, origin } = dropData

      mesh.position.x += velocity.x
      mesh.position.y += velocity.y
      mesh.position.z += velocity.z

      // Si la gota llega muy abajo, se reinicia a la posición original
      if (mesh.position.y < 0.6) {
        mesh.position.set(origin.x, origin.y, origin.z)
      }
    }
  })

  return (
    <>
      {initialDrops.map((drop, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (!drops.current[i]) {
              drops.current[i] = { ...drop, mesh: el }
            } else {
              drops.current[i].mesh = el
            }
          }}
          position={[drop.origin.x, drop.origin.y, drop.origin.z]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color="#00bfff" transparent opacity={0.7} />
        </mesh>
      ))}
    </>
  )
}
