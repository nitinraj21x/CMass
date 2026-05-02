# V2 Approach - Single-File Turn-Based Movement Planner

## Overview

This is an **alternative implementation approach** for the POE-2 turn-based movement system. Unlike the main v3 project which uses a modern React + Vite architecture with component separation, this v2 approach demonstrates a **single-file, vanilla JavaScript implementation**.

## Key Differences from V3

### Architecture
- **V2 (This Branch)**: Single HTML file with embedded CSS and JavaScript
- **V3 (Main Branch)**: Modular React application with separate components, game logic modules, and build tooling

### Technology Stack
- **V2**: Pure HTML5 Canvas + Vanilla JavaScript
- **V3**: React + Vite + Tailwind CSS + Modern ES6 modules

### Use Cases
- **V2**: 
  - Quick prototyping and testing
  - Minimal setup - just open in browser
  - Educational purposes - all code visible in one place
  - Embedding in simple web pages
  
- **V3**: 
  - Production-ready application
  - Scalable architecture for feature expansion
  - Modern development workflow with hot reload
  - Component reusability and maintainability

## Features

This v2 implementation includes:
- Turn-based movement planning with trajectory preview
- Speed-dependent rotation mechanics (curvature control)
- Deterministic physics simulation
- Visual debugging vectors (velocity and facing direction)
- Smooth execution playback with interpolation
- Keyboard controls (Arrow keys or WASD)

## How to Run

Simply open `index.html` in any modern web browser. No build process or dependencies required.

## Controls

- **Left Arrow / A**: Rotate left during planning phase
- **Right Arrow / D**: Rotate right during planning phase  
- **Up Arrow / W**: Apply thrust during planning phase
- **End Turn Button**: Execute the planned turn

## Physics Parameters

The movement system uses these core parameters:
- **Thrust**: 120 units/s² acceleration
- **Drag**: 0.985 (1.5% velocity reduction per frame)
- **Rotation Speed**: 3.0 rad/s base rotation
- **Curvature Factor**: 2.5 (controls speed-dependent turn radius)
- **Time Step**: 0.016s (60 FPS simulation)
- **Turn Duration**: 50 steps (~0.8 seconds)

## Why Two Approaches?

Both implementations solve the same problem but demonstrate different development philosophies:

1. **V2 (Single-File)**: Emphasizes simplicity, portability, and immediate accessibility
2. **V3 (Modular)**: Emphasizes maintainability, scalability, and modern best practices

Choose v2 for quick experiments or learning, choose v3 for building a full application.

## Related

- Main project (v3): See the `main` branch
- Original concept: Path of Exile 2 turn-based movement mechanics
