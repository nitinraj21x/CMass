import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <motion.span
          className="font-mono text-sm gradient-text font-bold"
          whileHover={{ scale: 1.05 }}
        >
          &lt;dev /&gt;
        </motion.span>

        <p className="text-text-dim text-xs text-center">
          Built with React, Three.js, Framer Motion & Tailwind CSS
        </p>

        <p className="text-text-dim text-xs">
          © {new Date().getFullYear()} — All rights reserved
        </p>
      </div>
    </footer>
  )
}
