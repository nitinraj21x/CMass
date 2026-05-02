import { useMemo, useRef, useState } from 'react'
import { GAME_PHASES } from '../game/constants'
import { addVectors, createVector, scaleVector } from '../game/vector'

const clampPoint = (point, width, height) => ({
  x: Math.max(0, Math.min(width, point.x)),
  y: Math.max(0, Math.min(height, point.y)),
})

const DRAG_THRESHOLD = 6

export default function VectorTacticsEngine({
  boardHeight,
  boardWidth,
  displayShips,
  gamePhase,
  plans,
  selectedProjection,
  selectedShipId,
  simulationDuration,
  onEmptyBoardClick,
  onBoardPointerMove,
  onBoardPointerUp,
  onShipPointerDown,
}) {
  const boardRef = useRef(null)
  const [dragState, setDragState] = useState({
    activeShipId: null,
    startPoint: createVector(),
    currentPoint: createVector(),
    didDrag: false,
  })

  const getBoardPoint = (event) => {
    const rect = boardRef.current?.getBoundingClientRect()
    if (!rect) {
      return createVector()
    }

    return clampPoint(
      {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
      boardWidth,
      boardHeight,
    )
  }

  const selectedShip = useMemo(
    () => displayShips.find(({ id }) => id === selectedShipId) ?? null,
    [displayShips, selectedShipId],
  )

  const liveArrowEnd = selectedShip && dragState.didDrag ? dragState.currentPoint : null

  return (
    <section className="battlefield-shell">
      <div className="battlefield-header">
        <div>
          <p className="eyebrow">Tactical Map</p>
          <h2>Time-Slice Planner</h2>
        </div>
        <div className="battlefield-note">
          {gamePhase === GAME_PHASES.SIMULATING
            ? 'Simulation running. Inputs locked until the burst completes.'
            : 'Drag from a selected ship to set its input vector.'}
        </div>
      </div>

      <div className="battlefield-scroll">
        <div
          className={`battlefield ${gamePhase === GAME_PHASES.SIMULATING ? 'is-simulating' : ''}`}
          onPointerDown={() => {
            if (dragState.activeShipId !== null || gamePhase === GAME_PHASES.SIMULATING) {
              return
            }

            onEmptyBoardClick()
          }}
          onPointerMove={(event) => {
            if (dragState.activeShipId === null) {
              return
            }

            const point = getBoardPoint(event)
            const hasExceededThreshold =
              Math.hypot(point.x - dragState.startPoint.x, point.y - dragState.startPoint.y) >=
              DRAG_THRESHOLD

            setDragState((current) => ({
              ...current,
              currentPoint: point,
              didDrag: current.didDrag || hasExceededThreshold,
            }))
            onBoardPointerMove(point, dragState.didDrag || hasExceededThreshold)
          }}
          onPointerUp={(event) => {
            const point = getBoardPoint(event)
            const wasDragging = dragState.didDrag
            const activeShipId = dragState.activeShipId

            setDragState({
              activeShipId: null,
              startPoint: point,
              currentPoint: point,
              didDrag: false,
            })

            if (activeShipId === null) {
              return
            }

            onBoardPointerUp(point, wasDragging)
          }}
          ref={boardRef}
          style={{ width: boardWidth, height: boardHeight }}
        >
          <div className="space-grid" />
          <div className="space-glow space-glow-a" />
          <div className="space-glow space-glow-b" />

          <svg
            aria-hidden="true"
            className="battlefield-overlay"
            viewBox={`0 0 ${boardWidth} ${boardHeight}`}
          >
            <defs>
              <marker
                id="trajectory-arrow"
                markerHeight="8"
                markerWidth="8"
                orient="auto"
                refX="7"
                refY="4"
              >
                <path d="M0,0 L8,4 L0,8 Z" fill="#6ff3d8" />
              </marker>
            </defs>

            {displayShips.map((ship) => {
              const planVector = plans[ship.id] ?? createVector()
              const projectedEnd = addVectors(
                ship.position,
                scaleVector(addVectors(ship.velocity, planVector), simulationDuration),
              )
              const hasPlan = planVector.x !== 0 || planVector.y !== 0

              return (
                <g key={ship.id}>
                  <line
                    className="velocity-guide"
                    x1={ship.position.x}
                    x2={projectedEnd.x}
                    y1={ship.position.y}
                    y2={projectedEnd.y}
                  />
                  {hasPlan ? (
                    <line
                      className="planned-arrow"
                      markerEnd="url(#trajectory-arrow)"
                      x1={ship.position.x}
                      x2={ship.position.x + planVector.x}
                      y1={ship.position.y}
                      y2={ship.position.y + planVector.y}
                    />
                  ) : null}
                </g>
              )
            })}

            {selectedShip && selectedProjection ? (
              <line
                className="selected-ghost"
                x1={selectedShip.position.x}
                x2={selectedProjection.x}
                y1={selectedShip.position.y}
                y2={selectedProjection.y}
              />
            ) : null}

            {selectedShip && liveArrowEnd ? (
              <line
                className="live-arrow"
                markerEnd="url(#trajectory-arrow)"
                x1={selectedShip.position.x}
                x2={liveArrowEnd.x}
                y1={selectedShip.position.y}
                y2={liveArrowEnd.y}
              />
            ) : null}
          </svg>

          {displayShips.map((ship) => (
            <button
              className={`ship-token ${ship.id === selectedShipId ? 'is-selected' : ''}`}
              key={ship.id}
              onPointerDown={(event) => {
                event.stopPropagation()
                const point = getBoardPoint(event)
                setDragState({
                  activeShipId: ship.id,
                  startPoint: point,
                  currentPoint: point,
                  didDrag: false,
                })
                onShipPointerDown(ship.id)
              }}
              style={{
                '--ship-color': ship.color,
                '--ship-accent': ship.accent,
                left: ship.position.x,
                top: ship.position.y,
                transform: `translate(-50%, -50%) rotate(${ship.rotation}deg)`,
                width: ship.radius * 2,
                height: ship.radius * 2,
              }}
              type="button"
            >
              <span className="ship-ring" />
              <span className="ship-hull" />
              <span className="ship-tail" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
