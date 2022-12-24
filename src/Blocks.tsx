import { InstancedRigidBodies } from "@react-three/rapier"
import * as THREE from "three"
import { useEffect, useMemo, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"

const COUNT = 160
const rows = 4
const cols = 10
const depth = 4

const baseColor = 0x1b998b
const highlight = 0xefcb68

const tempColor = new THREE.Color()

const generateRandomIndex = () =>
  new Array(10).fill(0).map(() => THREE.MathUtils.randInt(0, COUNT))

export default function Blocks() {
  const highlighted = useRef(generateRandomIndex())

  useEffect(() => {
    const interval = setInterval(
      () => (highlighted.current = generateRandomIndex()),
      2000
    )
    return () => clearInterval(interval)
  }, [])

  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(COUNT)
          .fill(0)
          .flatMap(() => tempColor.set(baseColor).toArray())
      ),
    []
  )

  const positions = useMemo(() => {
    const positions = []
    let i = 0

    for (let x = 0; x < rows; x++)
      for (let y = 0; y < cols; y++)
        for (let z = 0; z < depth; z++) {
          positions[i] = [x, y, z]
          i++
        }

    return positions
  }, [])

  useFrame(() => {
    for (let i = 0; i < COUNT; i++) {
      highlighted.current.includes(i)
        ? tempColor.set(highlight).toArray(colorArray, i * 3)
        : tempColor.set(baseColor).toArray(colorArray, i * 3)
      meshRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  return (
    <InstancedRigidBodies
      //@ts-ignore
      positions={positions}
      colliders='cuboid'
      mass={10}
      restitution={0}
      friction={1}
    >
      <instancedMesh
        args={[undefined, undefined, COUNT]}
        ref={meshRef}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.99, 0.99, 0.99]}>
          <instancedBufferAttribute
            attach='attributes-color'
            args={[colorArray, 3]}
          />
        </boxGeometry>
        <meshStandardMaterial vertexColors />
      </instancedMesh>
    </InstancedRigidBodies>
  )
}
