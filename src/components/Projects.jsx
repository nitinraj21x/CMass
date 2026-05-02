import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { projects } from '../data/portfolio'

const categories = ['All', 'AI', 'Web', 'Engineering']

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-2xl bg-surface border border-border overflow-hidden cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      {/* Top accent line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
        animate={{ opacity: hovered ? 1 : 0.4 }}
      />

      {/* Glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${project.color}15 0%, transparent 70%)`,
        }}
      />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-mono"
              style={{ background: project.color + '20', color: project.color, border: `1px solid ${project.color}30` }}
              animate={{ rotate: hovered ? 10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {project.category === 'AI' ? '🤖' : project.category === 'Web' ? '🌐' : '⚡'}
            </motion.div>
            <div>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full"
                style={{ background: project.color + '15', color: project.color }}
              >
                {project.category}
              </span>
            </div>
          </div>
          <span className="text-xs text-text-dim font-mono">{project.year}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors duration-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-text-dim text-sm leading-relaxed mb-5">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-bg border border-border text-text-dim"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          <motion.a
            href={project.link}
            className="flex items-center gap-1.5 text-xs font-medium text-text-dim hover:text-accent transition-colors"
            whileHover={{ x: 3 }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Live Demo
          </motion.a>
          <motion.a
            href={project.github}
            className="flex items-center gap-1.5 text-xs font-medium text-text-dim hover:text-accent transition-colors"
            whileHover={{ x: 3 }}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </motion.a>

          {project.featured && (
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              Featured
            </span>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="projects" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent-2/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <span className="font-mono text-sm text-accent tracking-widest uppercase flex items-center gap-3 mb-4">
            <span className="w-6 h-px bg-accent" />
            Selected Work
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Things I've <span className="gradient-text">built</span>
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
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
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
