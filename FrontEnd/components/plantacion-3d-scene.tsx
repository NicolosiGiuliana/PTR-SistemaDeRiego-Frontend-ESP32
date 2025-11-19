"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"
import * as THREE from "three"

interface Plantacion3DSceneProps {
  humedad: number
  luz: number
  riegoActivo: boolean
  iluminacionActiva: boolean
}

function Planta({ humedad, luz, riegoActivo }: Plantacion3DSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Color de la planta basado en la humedad y luz
  const color = new THREE.Color()
  const humedadColor = humedad / 100 // 0-1
  const luzColor = luz / 3000 // 0-1

  // Verde más oscuro si hay poca humedad, más claro si hay mucha
  color.setHSL(0.3, 0.8, 0.3 + humedadColor * 0.4)

  // Altura de la planta basada en la luz
  const altura = 1 + luzColor * 2

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Animación suave de la planta
      meshRef.current.rotation.y += delta * 0.2
      if (riegoActivo) {
        // Efecto de "crecimiento" cuando el riego está activo
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          altura,
          delta * 0.5
        )
      }
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <coneGeometry args={[0.5, altura, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Suelo({ humedad }: { humedad: number }) {
  const color = new THREE.Color()
  // Marrón más oscuro si hay poca humedad, más claro si hay mucha
  color.setHSL(0.1, 0.8, 0.3 + (humedad / 100) * 0.3)

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[5, 5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export function Plantacion3DScene(props: Plantacion3DSceneProps) {
  return (
    <div className="w-full h-[300px]">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        {props.iluminacionActiva && (
          <spotLight
            position={[2, 5, 2]}
            angle={0.5}
            penumbra={0.3}
            intensity={5}
            castShadow
          />
        )}
        <Planta {...props} />
        <Suelo humedad={props.humedad} />
        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>
    </div>
  )
}