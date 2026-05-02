export const createVector = (x = 0, y = 0) => ({ x, y })

export const addVectors = (left, right) => ({
  x: left.x + right.x,
  y: left.y + right.y,
})

export const subtractVectors = (left, right) => ({
  x: left.x - right.x,
  y: left.y - right.y,
})

export const scaleVector = (vector, scalar) => ({
  x: vector.x * scalar,
  y: vector.y * scalar,
})

export const getVectorMagnitude = (vector) => Math.hypot(vector.x, vector.y)

export const clampMagnitude = (vector, maxMagnitude) => {
  const magnitude = getVectorMagnitude(vector)
  if (magnitude === 0 || magnitude <= maxMagnitude) {
    return { ...vector }
  }

  const scale = maxMagnitude / magnitude
  return scaleVector(vector, scale)
}

export const getHeadingFromVector = (vector, fallback = 0) => {
  if (getVectorMagnitude(vector) === 0) {
    return fallback
  }

  return (Math.atan2(vector.y, vector.x) * 180) / Math.PI + 90
}

export const getShortestAngleDelta = (startAngle, endAngle) => {
  let delta = endAngle - startAngle

  while (delta > 180) {
    delta -= 360
  }

  while (delta < -180) {
    delta += 360
  }

  return delta
}
