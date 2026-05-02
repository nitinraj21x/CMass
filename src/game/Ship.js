export class Ship {
  constructor({
    id,
    label,
    position,
    velocity,
    maxThrust,
    mass,
    rotation = 0,
    radius = 16,
    color = '#8ddcff',
    accent = '#6ff3d8',
  }) {
    this.id = id
    this.label = label
    this.position = { ...position }
    this.velocity = { ...velocity }
    this.maxThrust = maxThrust
    this.mass = mass
    this.rotation = rotation
    this.radius = radius
    this.color = color
    this.accent = accent
  }
}
