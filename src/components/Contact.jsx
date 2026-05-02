import { useRef, useState, Suspense } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

function ContactOrb() {
  const meshRef = useRef()
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#6c63ff"
          emissive="#6c63ff"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.8}
          wireframe
        />
      </mesh>
    </Float>
  )
}

const socialLinks = [
  { label: 'GitHub', href: '#', icon: 'GH' },
  { label: 'LinkedIn', href: '#', icon: 'LI' },
  { label: 'Twitter', href: '#', icon: 'TW' },
  { label: 'Email', href: 'mailto:hello@dev.com', icon: '@' },
]

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [focused, setFocused] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section id="contact" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

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
            Get In Touch
            <span className="w-6 h-px bg-accent" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let's build something{' '}
            <span className="gradient-text">together</span>
          </h2>
          <p className="text-text-dim max-w-lg mx-auto">
            Have a project in mind? I'm always open to discussing new opportunities and creative ideas.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* 3D visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="h-64 lg:h-96 relative order-2 lg:order-1"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={2} color="#6c63ff" />
                <pointLight position={[-5, -5, 5]} intensity={1} color="#ff6584" />
                <ContactOrb />
              </Suspense>
            </Canvas>

            {/* Social links */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4">
              {socialLinks.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-xs font-mono text-text-dim hover:text-accent hover:border-accent/40 transition-all duration-200"
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  title={s.label}
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-accent-3/10 border border-accent-3/30 flex items-center justify-center text-3xl mx-auto mb-6"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✓
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">Message sent!</h3>
                  <p className="text-text-dim">I'll get back to you within 24 hours.</p>
                  <motion.button
                    onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', message: '' }) }}
                    className="mt-6 text-sm text-accent hover:underline"
                    whileHover={{ scale: 1.05 }}
                  >
                    Send another
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {[
                    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                  ].map((field) => (
                    <div key={field.name} className="relative">
                      <motion.label
                        className="block text-xs font-medium mb-2 transition-colors duration-200"
                        style={{ color: focused === field.name ? 'var(--accent)' : 'var(--text-dim)' }}
                      >
                        {field.label}
                      </motion.label>
                      <motion.input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formState[field.name]}
                        onChange={(e) => setFormState({ ...formState, [field.name]: e.target.value })}
                        onFocus={() => setFocused(field.name)}
                        onBlur={() => setFocused(null)}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-surface border text-text placeholder-muted text-sm transition-all duration-200 input-glow"
                        style={{
                          borderColor: focused === field.name ? 'rgba(108,99,255,0.5)' : 'var(--border)',
                        }}
                        animate={{ borderColor: focused === field.name ? 'rgba(108,99,255,0.5)' : '#1a1a2e' }}
                      />
                    </div>
                  ))}

                  <div className="relative">
                    <motion.label
                      className="block text-xs font-medium mb-2 transition-colors duration-200"
                      style={{ color: focused === 'message' ? 'var(--accent)' : 'var(--text-dim)' }}
                    >
                      Message
                    </motion.label>
                    <textarea
                      placeholder="Tell me about your project..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-surface border text-text placeholder-muted text-sm transition-all duration-200 input-glow resize-none"
                      style={{
                        borderColor: focused === 'message' ? 'rgba(108,99,255,0.5)' : 'var(--border)',
                      }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-accent text-white font-semibold text-sm tracking-wide relative overflow-hidden disabled:opacity-70"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(108,99,255,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <motion.span
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                          Sending...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="send"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Send Message →
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
