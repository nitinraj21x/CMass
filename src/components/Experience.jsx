import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { experience } from '../data/portfolio'

function TimelineItem({ item, index, inView }) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15 + 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative flex items-start gap-6 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      {/* Content card */}
      <motion.div
        className="flex-1 group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="relative p-6 rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-300 group-hover:border-opacity-60"
          style={{ '--hover-color': item.color }}
        >
          {/* Accent line */}
          <div
            className="absolute top-0 left-0 w-full h-0.5 opacity-60"
            style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle at 0% 0%, ${item.color}10 0%, transparent 60%)` }}
          />

          <div className="flex items-start justify-between mb-3">
            <div>
              <span
                className="text-xs font-mono px-2 py-0.5 rounded-full mb-2 inline-block"
                style={{ background: item.color + '15', color: item.color }}
              >
                {item.type === 'work' ? '💼 Work' : '🎓 Education'}
              </span>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-text-dim text-sm">{item.company}</p>
            </div>
            <span className="text-xs font-mono text-text-dim whitespace-nowrap ml-4">{item.period}</span>
          </div>

          <p className="text-text-dim text-sm leading-relaxed mb-4">{item.description}</p>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-bg border border-border text-text-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline node */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        <motion.div
          className="w-4 h-4 rounded-full border-2 z-10 relative"
          style={{ borderColor: item.color, background: item.color + '30' }}
          animate={inView ? { scale: [0, 1.3, 1] } : { scale: 0 }}
          transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: item.color }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
          />
        </motion.div>
      </div>

      {/* Spacer for alternating layout on desktop */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  )
}

export default function Experience() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="experience" ref={ref} className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-3/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-sm text-accent tracking-widest uppercase flex items-center justify-center gap-3 mb-4">
            <span className="w-6 h-px bg-accent" />
            Journey
            <span className="w-6 h-px bg-accent" />
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Experience &{' '}
            <span className="gradient-text">Education</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-[calc(50%-0.5px)] md:left-[calc(50%-0.5px)] left-[1.75rem] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />

          <div className="space-y-10">
            {experience.map((item, i) => (
              <TimelineItem key={item.id} item={item} index={i} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
