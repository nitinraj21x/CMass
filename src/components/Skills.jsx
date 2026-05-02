import { useRef, useState, Suspense } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text3D, Center } from '@react-three/drei'
import { skills } from '../data/portfolio'

function SkillOrb({ skill, index, total }) {
  const meshRef = useRef()
  const angle = (index / total) * Math.PI * 2
  const radius = 2.2
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.15
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  const color = skill.color
  return (
    <mesh ref={meshRef} position={[x, 0, z]}>
      <sphereGeometry args={[0.18 + (skill.level / 100) * 0.12, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  )
}

function OrbScene() {
  const groupRef = useRef()
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12
    }
  })

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <SkillOrb key={skill.name} skill={skill} index={i} total={skills.length} />
      ))}
      {/* Center sphere */}
      <Float speed={1.5} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[0.5, 64, 64]} />
          <meshStandardMaterial
            color="#6c63ff"
            emissive="#6c63ff"
            emissiveIntensity={0.3}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Float>
      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.008, 16, 200]} />
        <meshBasicMaterial color="#6c63ff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function SkillBar({ skill, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono"
            style={{ background: skill.color + '20', color: skill.color, border: `1px solid ${skill.color}30` }}
            whileHover={{ scale: 1.2, rotate: 10 }}
          >
            {skill.icon}
          </motion.div>
          <span className="text-sm font-medium">{skill.name}</span>
        </div>
        <motion.span
          className="text-xs font-mono"
          style={{ color: skill.color }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: index * 0.08 + 0.6 }}
        >
          {skill.level}%
        </motion.span>
      </div>

      <div className="h-1.5 bg-surface rounded-full overflow-hidden border border-border">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ delay: index * 0.08 + 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  )
}

const categories = ['All', 'core', 'advanced', 'engineering', 'hobby']

export default function Skills() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => s.category === activeCategory)

  return (
    <section id="skills" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent to-accent/30" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-accent tracking-widest uppercase flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-accent" />
            Skills & Expertise
            <span className="w-6 h-px bg-accent" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            What I <span className="gradient-text">work with</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 3D Orb scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-80 lg:h-[500px] relative"
          >
            <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <pointLight position={[5, 5, 5]} intensity={2} color="#6c63ff" />
                <pointLight position={[-5, -5, -5]} intensity={1} color="#ff6584" />
                <OrbScene />
              </Suspense>
            </Canvas>
            {/* Legend overlay */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 flex-wrap px-4">
              {skills.slice(0, 4).map((s) => (
                <div key={s.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-text-dim">{s.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Skill bars */}
          <div>
            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-accent text-white'
                      : 'bg-surface border border-border text-text-dim hover:border-accent/40 hover:text-text'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </motion.div>

            <div className="space-y-5">
              {filtered.map((skill, i) => (
                <SkillBar key={skill.name} skill={skill} index={i} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
