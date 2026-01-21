/**
 * Represents a 2D transform with position, rotation, and scale.
 * Used for bone transformations in the skeleton system.
 */
export interface TransformData {
  x?: number;
  y?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export class Transform {
  x: number;
  y: number;
  rotation: number; // in degrees
  scaleX: number;
  scaleY: number;

  constructor(data: TransformData = {}) {
    this.x = data.x ?? 0;
    this.y = data.y ?? 0;
    this.rotation = data.rotation ?? 0;
    this.scaleX = data.scaleX ?? 1;
    this.scaleY = data.scaleY ?? 1;
  }

  /**
   * Creates a deep copy of this transform
   */
  clone(): Transform {
    return new Transform({
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      scaleX: this.scaleX,
      scaleY: this.scaleY,
    });
  }

  /**
   * Linearly interpolates between this transform and another
   * @param target The target transform to interpolate towards
   * @param t Interpolation factor (0-1)
   */
  lerp(target: Transform, t: number): Transform {
    return new Transform({
      x: this.x + (target.x - this.x) * t,
      y: this.y + (target.y - this.y) * t,
      rotation: this.lerpAngle(this.rotation, target.rotation, t),
      scaleX: this.scaleX + (target.scaleX - this.scaleX) * t,
      scaleY: this.scaleY + (target.scaleY - this.scaleY) * t,
    });
  }

  /**
   * Interpolates between two angles, taking the shortest path
   */
  private lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;
    // Normalize to [-180, 180]
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return a + diff * t;
  }

  /**
   * Copies values from another transform
   */
  copyFrom(other: Transform): void {
    this.x = other.x;
    this.y = other.y;
    this.rotation = other.rotation;
    this.scaleX = other.scaleX;
    this.scaleY = other.scaleY;
  }

  /**
   * Resets transform to identity
   */
  reset(): void {
    this.x = 0;
    this.y = 0;
    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
  }

  /**
   * Converts rotation from degrees to radians
   */
  get rotationRadians(): number {
    return (this.rotation * Math.PI) / 180;
  }

  /**
   * Converts to a plain object for serialization
   */
  toJSON(): TransformData {
    const data: TransformData = {};
    if (this.x !== 0) data.x = this.x;
    if (this.y !== 0) data.y = this.y;
    if (this.rotation !== 0) data.rotation = this.rotation;
    if (this.scaleX !== 1) data.scaleX = this.scaleX;
    if (this.scaleY !== 1) data.scaleY = this.scaleY;
    return data;
  }

  /**
   * Creates a Transform from JSON data
   */
  static fromJSON(data: TransformData): Transform {
    return new Transform(data);
  }
}
