# POE-2 Turn-Based Movement System

A React + Vite implementation of a turn-based movement planner inspired by Path of Exile 2's tactical combat mechanics.

## 🎮 Features

- **Turn-based movement planning** with real-time trajectory preview
- **Speed-dependent rotation mechanics** - faster ships have wider turn radius
- **Deterministic physics simulation** - what you see is what you get
- **Visual debugging tools** - velocity and facing vectors
- **Smooth execution playback** with frame interpolation
- **Vector Tactics Engine** - interactive game component

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open your browser to the local development server (typically `http://localhost:5173`)

## 🎯 Controls

- **Arrow Keys / WASD**: Control ship rotation and thrust during planning
- **End Turn Button**: Execute the planned movement
- **Mouse**: Navigate the UI and interact with components

## 📂 Project Structure

This is a **modular React application** with:
- Separate component files for maintainability
- Game logic modules (`Ship.js`, `vector.js`, `constants.js`)
- Modern build tooling (Vite + React)
- Tailwind CSS for styling

## 🔀 Alternative Approach Available

This repository contains **two different implementations**:

### Main Branch (V3) - Current
- **Architecture**: Modular React + Vite application
- **Best for**: Production apps, scalable projects, modern development
- **Setup**: Requires npm install and build process

### V2 Branch - Single-File Approach
- **Architecture**: Single HTML file with vanilla JavaScript
- **Best for**: Quick prototyping, learning, simple embedding
- **Setup**: Just open `index.html` in a browser
- **Branch**: `v2-single-file-approach`

See the [v2-approach README](./v2-approach/README.md) for details on the alternative implementation.

## 🛠️ Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **HTML5 Canvas** - Game rendering
- **ESLint** - Code quality

## 📖 Physics System

The movement system implements:
- **Thrust**: 120 units/s² acceleration
- **Drag**: 0.985 coefficient (1.5% per frame)
- **Rotation**: Speed-dependent with curvature control
- **Simulation**: Fixed 60 FPS timestep for determinism

## 🔧 Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📝 React + Vite Configuration

This template uses:
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) with [Oxc](https://oxc.rs)
- Hot Module Replacement (HMR) for fast development
- ESLint for code quality

For TypeScript integration, see the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts).
