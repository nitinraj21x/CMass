import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const highlights = [
  { label: 'React & JS', color: '#6c63ff' },
  { label: 'Agentic AI', color: '#ff6584' },
  { label: 'ECE', color: '#43e97b' },
  { label: '3D Web', color: '#ffd700' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left — visual */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="relative"
          >
            {/* Card stack */}
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Background cards */}
              <div className="absolute inset-4 rounded-2xl bg-surface border border-border rotate-6 opacity-40" />
              <div className="absolute inset-2 rounded-2xl bg-surface border border-border rotate-3 opacity-60" />

              {/* Main card */}
              <motion.div
                className="relative rounded-2xl bg-surface border border-border p-8 h-full flex flex-col justify-between overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Glow */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-accent-2 to-accent-3" />

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Full-Stack Creative</h3>
                  <p className="text-text-dim text-sm leading-relaxed">
                    Bridging the gap between engineering precision and creative expression.
                  </p>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2 mt-6">
                  {highlights.map((h) => (
                    <motion.span
                      key={h.label}
                      className="px-3 py-1 rounded-full text-xs font-medium border"
                      style={{ borderColor: h.color + '40', color: h.color, background: h.color + '10' }}
                      whileHover={{ scale: 1.1 }}
                    >
                      {h.label}
                    </motion.span>
                  ))}
                </div>

                {/* Decorative grid */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {Array.from({ length: 5 }).map((_, i) =>
                      Array.from({ length: 5 }).map((_, j) => (
                        <circle key={`${i}-${j}`} cx={i * 25} cy={j * 25} r="2" fill="white" />
                      ))
                    )}
                  </svg>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — text */}
          <div className="space-y-6">
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              <span className="font-mono text-sm text-accent tracking-widest uppercase flex items-center gap-3">
                <span className="w-6 h-px bg-accent" />
                About Me
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-4xl md:text-5xl font-bold leading-tight"
            >
              I turn ideas into{' '}
              <span className="gradient-text">living interfaces</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-text-dim leading-relaxed text-lg"
            >
              I'm a developer with a background in Electronics & Communication Engineering who fell
              in love with the web. I specialize in building interactive, animated, and
              performance-focused applications using React, Three.js, and modern AI tooling.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="text-text-dim leading-relaxed"
            >
              My work sits at the intersection of engineering rigor and creative design — whether
              that's a 3D web experience, an agentic AI pipeline, or a signal processing tool. I
              believe every pixel and every interaction should feel intentional.
            </motion.p>

            {/* Values */}
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {[
                { icon: '⚡', label: 'Performance First' },
                { icon: '🎨', label: 'Design-Driven' },
                { icon: '🤖', label: 'AI-Augmented' },
                { icon: '📡', label: 'Systems Thinker' },
              ].map((v) => (
                <motion.div
                  key={v.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border"
                  whileHover={{ borderColor: 'rgba(108,99,255,0.4)', x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="text-lg">{v.icon}</span>
                  <span className="text-sm font-medium">{v.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
