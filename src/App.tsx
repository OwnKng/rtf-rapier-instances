import { Canvas, useFrame } from "@react-three/fiber"
import { Physics, RigidBody, RigidBodyApi } from "@react-three/rapier"
import Blocks from "./Blocks"
import { useRef } from "react"
import * as THREE from "three"

const SPEED = 15

export default function App() {
  return (
    <Canvas
      className='App'
      orthographic
      onCreated={({ camera }) => {
        camera.position.setFromSphericalCoords(20, Math.PI / 3, Math.PI / 4)
        camera.position.y += 5
        camera.lookAt(0, 0, 0)
        camera.zoom = 40
      }}
      shadows
    >
      <Sketch />
    </Canvas>
  )
}

const Sketch = () => {
  const cursorPos = useRef(new THREE.Vector3(0, 0, 10))
  const playerRef = useRef<RigidBodyApi>(null!)

  useFrame(() => {
    const pos = playerRef.current.translation().clone()

    const target = cursorPos.current.clone().sub(pos)
    target.setLength(SPEED)

    playerRef.current.setLinvel(target)
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[0, 200, 200]}
        castShadow
        intensity={1.2}
        shadow-mapSize={[256, 256]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <Physics>
        <Blocks />
        <RigidBody type='fixed'>
          <mesh
            receiveShadow
            position={[0, -0.5, 0]}
            onPointerMove={(e) => (cursorPos.current = e.point)}
          >
            <boxGeometry args={[10000, 0.5, 10000]} />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>
        </RigidBody>
        <RigidBody
          type='dynamic'
          colliders='ball'
          ref={playerRef}
          position={[0, 0, 20]}
          mass={20}
        >
          <mesh receiveShadow castShadow>
            <icosahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color='tomato' flatShading />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
