import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

function AnimatedSphere() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1.4, 100, 200]} scale={1}>
        <MeshDistortMaterial
          color="#6c63ff"
          attach="material"
          distort={0.45}
          speed={2.5}
          roughness={0.1}
          metalness={0.8}
          wireframe={false}
        />
      </Sphere>
    </Float>
  )
}

function ParticleField() {
  const pointsRef = useRef()
  const count = 1500
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#6c63ff" transparent opacity={0.6} sizeAttenuation />
    </points>
  )
}

function RingMesh() {
  const ringRef = useRef()
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.2
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.1
    }
  })
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.2, 0.015, 16, 200]} />
      <meshBasicMaterial color="#ff6584" transparent opacity={0.5} />
    </mesh>
  )
}

function RingMesh2() {
  const ringRef = useRef()
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 3 + Math.cos(state.clock.elapsedTime * 0.2) * 0.3
      ringRef.current.rotation.z = -state.clock.elapsedTime * 0.15
    }
  })
  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[2.8, 0.01, 16, 200]} />
      <meshBasicMaterial color="#43e97b" transparent opacity={0.3} />
    </mesh>
  )
}

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15 + 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#6c63ff" />
            <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#ff6584" />
            <pointLight position={[0, 0, 3]} intensity={2} color="#6c63ff" />
            <Stars radius={80} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
            <ParticleField />
            <AnimatedSphere />
            <RingMesh />
            <RingMesh2 />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-bg via-bg/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[1] bg-gradient-to-t from-bg to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="max-w-2xl">
          <motion.div
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-accent" />
            <span className="font-mono text-sm text-accent tracking-widest uppercase">
              Available for work
            </span>
            <span className="w-2 h-2 rounded-full bg-accent-3 animate-pulse" />
          </motion.div>

          <motion.h1
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
          >
            Creative
            <br />
            <span className="gradient-text">Developer</span>
            <br />
            & Engineer
          </motion.h1>

          <motion.p
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-text-dim text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
          >
            I build immersive web experiences at the intersection of{' '}
            <span className="text-accent font-medium">engineering</span>,{' '}
            <span className="text-accent-2 font-medium">AI</span>, and{' '}
            <span className="text-accent-3 font-medium">design</span>.
          </motion.p>

          <motion.div
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4"
          >
            <motion.a
              href="#projects"
              className="px-8 py-3.5 rounded-full bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent/90 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(108,99,255,0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3.5 rounded-full border border-border text-text-dim font-semibold text-sm tracking-wide hover:border-accent hover:text-accent transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex gap-10 mt-16"
          >
            {[
              { value: '15+', label: 'Projects' },
              { value: '3+', label: 'Years Exp.' },
              { value: '100%', label: 'Passion' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold gradient-text-2">{stat.value}</div>
                <div className="text-xs text-text-dim mt-1 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-text-dim uppercase tracking-widest font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-accent to-transparent"
        />
      </motion.div>
    </section>
  )
}
