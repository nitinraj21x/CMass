import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import VectorTacticsEngine from './components/VectorTacticsEngine'
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  GAME_PHASES,
  SIMULATION_DURATION,
  createInitialShips,
} from './game/constants'
import { Ship } from './game/Ship'
import {
  addVectors,
  clampMagnitude,
  createVector,
  getHeadingFromVector,
  getVectorMagnitude,
  getShortestAngleDelta,
  scaleVector,
  subtractVectors,
} from './game/vector'

const cloneShip = (ship) =>
  new Ship({
    id: ship.id,
    label: ship.label,
    position: ship.position,
    velocity: ship.velocity,
    maxThrust: ship.maxThrust,
    mass: ship.mass,
    rotation: ship.rotation,
    radius: ship.radius,
    color: ship.color,
    accent: ship.accent,
  })

const cloneShips = (ships) => ships.map(cloneShip)

const getSimulationSnapshot = (ships, plans) =>
  ships.map((ship) => {
    const planVector = plans[ship.id] ?? createVector()
    const finalVelocity = addVectors(ship.velocity, planVector)

    return {
      id: ship.id,
      initialPosition: ship.position,
      initialVelocity: ship.velocity,
      finalVelocity,
      startRotation: ship.rotation,
      targetRotation: getHeadingFromVector(finalVelocity, ship.rotation),
    }
  })

const buildNextShips = (ships, plans) =>
  ships.map((ship) => {
    const planVector = plans[ship.id] ?? createVector()
    const finalVelocity = addVectors(ship.velocity, planVector)
    const finalPosition = addVectors(
      ship.position,
      scaleVector(finalVelocity, SIMULATION_DURATION),
    )

    return new Ship({
      ...ship,
      position: finalPosition,
      velocity: finalVelocity,
      rotation: getHeadingFromVector(finalVelocity, ship.rotation),
    })
  })

const initialState = {
  phase: GAME_PHASES.WAITING,
  ships: createInitialShips(),
  selectedShipId: null,
  plans: {},
  simulationSnapshot: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_SHIP':
      return {
        ...state,
        phase: GAME_PHASES.PLANNING,
        selectedShipId: action.shipId,
      }
    case 'CLEAR_SELECTION':
      return {
        ...state,
        phase: GAME_PHASES.WAITING,
        selectedShipId: null,
      }
    case 'SET_PLAN': {
      const ship = state.ships.find(({ id }) => id === action.shipId)
      if (!ship) {
        return state
      }

      const limitedVector = clampMagnitude(action.vector, ship.maxThrust / ship.mass)

      return {
        ...state,
        phase: GAME_PHASES.PLANNING,
        selectedShipId: action.shipId,
        plans: {
          ...state.plans,
          [action.shipId]: limitedVector,
        },
      }
    }
    case 'CLEAR_PLAN': {
      const nextPlans = { ...state.plans }
      delete nextPlans[action.shipId]

      return {
        ...state,
        plans: nextPlans,
      }
    }
    case 'START_SIMULATION':
      return {
        ...state,
        phase: GAME_PHASES.SIMULATING,
        selectedShipId: null,
        simulationSnapshot: getSimulationSnapshot(state.ships, state.plans),
      }
    case 'FINISH_SIMULATION':
      return {
        ...state,
        phase: GAME_PHASES.WAITING,
        ships: cloneShips(action.nextShips),
        plans: {},
        simulationSnapshot: [],
      }
    case 'RESET_BATTLEFIELD':
      return {
        ...initialState,
        ships: createInitialShips(),
      }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [displayShips, setDisplayShips] = useState(() => cloneShips(initialState.ships))
  const simulationFrameRef = useRef(null)
  const simulationStartRef = useRef(0)

  const hasPlans = useMemo(
    () => Object.values(state.plans).some((plan) => getVectorMagnitude(plan) > 0),
    [state.plans],
  )

  useEffect(() => {
    if (state.phase !== GAME_PHASES.SIMULATING) {
      setDisplayShips(cloneShips(state.ships))
    }
  }, [state.phase, state.ships])

  useEffect(() => {
    if (state.phase !== GAME_PHASES.SIMULATING || state.simulationSnapshot.length === 0) {
      return undefined
    }

    simulationStartRef.current = performance.now()

    const animate = (now) => {
      const elapsed = Math.min((now - simulationStartRef.current) / 1000, SIMULATION_DURATION)
      const progress = elapsed / SIMULATION_DURATION

      const nextDisplayShips = state.ships.map((ship) => {
        const snapshot = state.simulationSnapshot.find(({ id }) => id === ship.id)
        if (!snapshot) {
          return cloneShip(ship)
        }

        const livePosition = addVectors(
          snapshot.initialPosition,
          scaleVector(snapshot.finalVelocity, elapsed),
        )

        const rotationDelta = getShortestAngleDelta(
          snapshot.startRotation,
          snapshot.targetRotation,
        )
        const liveRotation = snapshot.startRotation + rotationDelta * progress

        return new Ship({
          ...ship,
          position: livePosition,
          rotation: liveRotation,
        })
      })

      setDisplayShips(nextDisplayShips)

      if (elapsed >= SIMULATION_DURATION) {
        dispatch({
          type: 'FINISH_SIMULATION',
          nextShips: buildNextShips(state.ships, state.plans),
        })
        return
      }

      simulationFrameRef.current = requestAnimationFrame(animate)
    }

    simulationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (simulationFrameRef.current) {
        cancelAnimationFrame(simulationFrameRef.current)
      }
    }
  }, [state.phase, state.plans, state.ships, state.simulationSnapshot])

  const selectedShip = state.selectedShipId
    ? state.ships.find(({ id }) => id === state.selectedShipId) ?? null
    : null

  const selectedPlan = selectedShip ? state.plans[selectedShip.id] ?? createVector() : createVector()

  const selectedProjection = selectedShip
    ? addVectors(
        selectedShip.position,
        scaleVector(addVectors(selectedShip.velocity, selectedPlan), SIMULATION_DURATION),
      )
    : null

  const selectedSpeed = selectedShip ? getVectorMagnitude(selectedShip.velocity) : 0
  const selectedProjectedSpeed = selectedShip
    ? getVectorMagnitude(addVectors(selectedShip.velocity, selectedPlan))
    : 0

  const handleShipPointerDown = (shipId) => {
    if (state.phase === GAME_PHASES.SIMULATING) {
      return
    }

    dispatch({ type: 'SELECT_SHIP', shipId })
  }

  const handleBoardPointerMove = (point, isDragging) => {
    if (!isDragging || state.phase === GAME_PHASES.SIMULATING || !selectedShip) {
      return
    }

    const dragVector = subtractVectors(point, selectedShip.position)
    dispatch({ type: 'SET_PLAN', shipId: selectedShip.id, vector: dragVector })
  }

  const handleBoardPointerUp = (point, wasDragging) => {
    if (state.phase === GAME_PHASES.SIMULATING) {
      return
    }

    if (!selectedShip) {
      return
    }

    if (!wasDragging) {
      return
    }

    const dragVector = subtractVectors(point, selectedShip.position)
    dispatch({ type: 'SET_PLAN', shipId: selectedShip.id, vector: dragVector })
  }

  const handleEmptyBoardClick = () => {
    if (state.phase === GAME_PHASES.SIMULATING) {
      return
    }

    dispatch({ type: 'CLEAR_SELECTION' })
  }

  return (
    <main className="app-shell">
      <section className="hud-panel intro-panel">
        <p className="eyebrow">Phase 1 Prototype</p>
        <h1>Vector-Tactics Engine</h1>
        <p className="intro-copy">
          Plot a thrust vector, preview the two-second outcome, and commit to a short burst
          simulation that respects momentum.
        </p>
        <div className="status-strip">
          <div>
            <span className="status-label">Environment</span>
            <strong>React + Vite</strong>
          </div>
          <div>
            <span className="status-label">Phase</span>
            <strong>{state.phase}</strong>
          </div>
          <div>
            <span className="status-label">Burst</span>
            <strong>{SIMULATION_DURATION.toFixed(1)}s</strong>
          </div>
        </div>
      </section>

      <VectorTacticsEngine
        boardHeight={BOARD_HEIGHT}
        boardWidth={BOARD_WIDTH}
        displayShips={displayShips}
        gamePhase={state.phase}
        plans={state.plans}
        selectedProjection={selectedProjection}
        selectedShipId={state.selectedShipId}
        simulationDuration={SIMULATION_DURATION}
        onEmptyBoardClick={handleEmptyBoardClick}
        onBoardPointerMove={handleBoardPointerMove}
        onBoardPointerUp={handleBoardPointerUp}
        onShipPointerDown={handleShipPointerDown}
      />

      <aside className="hud-panel side-panel">
        <div className="panel-block">
          <p className="eyebrow">Command Console</p>
          <h2>Flight State</h2>
          <p className="support-copy">
            Select any ship, drag out a vector arrow, and press commit to run the exact
            two-second slice.
          </p>
        </div>

        <div className="panel-block metrics-grid">
          <div className="metric-card">
            <span className="status-label">Selected</span>
            <strong>{selectedShip?.label ?? 'None'}</strong>
          </div>
          <div className="metric-card">
            <span className="status-label">Current Speed</span>
            <strong>{selectedSpeed.toFixed(1)} px/s</strong>
          </div>
          <div className="metric-card">
            <span className="status-label">Projected Speed</span>
            <strong>{selectedProjectedSpeed.toFixed(1)} px/s</strong>
          </div>
          <div className="metric-card">
            <span className="status-label">Committed Plans</span>
            <strong>{Object.keys(state.plans).length}</strong>
          </div>
        </div>

        {selectedShip ? (
          <div className="panel-block ship-readout">
            <h3>{selectedShip.label}</h3>
            <dl>
              <div>
                <dt>Position</dt>
                <dd>
                  {selectedShip.position.x.toFixed(0)}, {selectedShip.position.y.toFixed(0)}
                </dd>
              </div>
              <div>
                <dt>Velocity</dt>
                <dd>
                  {selectedShip.velocity.x.toFixed(1)}, {selectedShip.velocity.y.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt>Input Vector</dt>
                <dd>
                  {selectedPlan.x.toFixed(1)}, {selectedPlan.y.toFixed(1)}
                </dd>
              </div>
              <div>
                <dt>Max Thrust</dt>
                <dd>{selectedShip.maxThrust.toFixed(0)}</dd>
              </div>
              <div>
                <dt>Mass</dt>
                <dd>{selectedShip.mass.toFixed(1)}</dd>
              </div>
              {selectedProjection ? (
                <div>
                  <dt>2s Projection</dt>
                  <dd>
                    {selectedProjection.x.toFixed(0)}, {selectedProjection.y.toFixed(0)}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>
        ) : (
          <div className="panel-block ship-readout empty">
            <h3>No Ship Selected</h3>
            <p>Each arrow length maps directly to pixels per second added over the next burst.</p>
          </div>
        )}

        <div className="panel-block action-block">
          <button
            className="primary-button"
            disabled={!hasPlans || state.phase === GAME_PHASES.SIMULATING}
            onClick={() => dispatch({ type: 'START_SIMULATION' })}
            type="button"
          >
            Commit 2s Burst
          </button>
          <button
            className="secondary-button"
            disabled={state.phase === GAME_PHASES.SIMULATING}
            onClick={() => dispatch({ type: 'RESET_BATTLEFIELD' })}
            type="button"
          >
            Reset Scenario
          </button>
        </div>
      </aside>
    </main>
  )
}
