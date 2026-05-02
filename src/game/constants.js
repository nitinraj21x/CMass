import { Ship } from './Ship'
import { createVector, getHeadingFromVector } from './vector'

export const GAME_PHASES = {
  WAITING: 'WAITING',
  PLANNING: 'PLANNING',
  SIMULATING: 'SIMULATING',
}

export const BOARD_WIDTH = 980
export const BOARD_HEIGHT = 640
export const SIMULATION_DURATION = 2

export const INITIAL_SHIPS = [
  {
    id: 's-1',
    label: 'Aegis',
    position: { x: 220, y: 190 },
    velocity: { x: 56, y: 22 },
    maxThrust: 120,
    mass: 1,
    radius: 18,
    color: '#7dd3fc',
    accent: '#c4b5fd',
  },
  {
    id: 's-2',
    label: 'Nomad',
    position: { x: 360, y: 420 },
    velocity: { x: 30, y: -42 },
    maxThrust: 96,
    mass: 0.9,
    radius: 16,
    color: '#f9a8d4',
    accent: '#fdba74',
  },
  {
    id: 's-3',
    label: 'Strata',
    position: { x: 700, y: 280 },
    velocity: { x: -46, y: 18 },
    maxThrust: 132,
    mass: 1.15,
    radius: 20,
    color: '#86efac',
    accent: '#fef08a',
  },
]

export const createInitialShips = () =>
  INITIAL_SHIPS.map(
    (config) =>
      new Ship({
        ...config,
        rotation: getHeadingFromVector(config.velocity, 0),
      }),
  )

export const EMPTY_VECTOR = createVector()
