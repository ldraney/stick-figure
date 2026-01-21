/**
 * Represents a joint (connection point) in the skeleton.
 * Joints are positioned relative to their parent bone.
 */
export interface JointData {
  name: string;
  x: number;
  y: number;
}

export class Joint {
  readonly name: string;

  // Bind pose position (local to parent)
  readonly bindX: number;
  readonly bindY: number;

  // Current world position (computed during render)
  worldX: number = 0;
  worldY: number = 0;

  constructor(data: JointData) {
    this.name = data.name;
    this.bindX = data.x;
    this.bindY = data.y;
    this.worldX = data.x;
    this.worldY = data.y;
  }

  /**
   * Updates world position based on parent transform
   */
  updateWorldPosition(parentX: number, parentY: number, parentRotation: number): void {
    const rad = (parentRotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Rotate bind position by parent rotation and add parent position
    this.worldX = parentX + (this.bindX * cos - this.bindY * sin);
    this.worldY = parentY + (this.bindX * sin + this.bindY * cos);
  }

  /**
   * Resets to bind pose position
   */
  reset(): void {
    this.worldX = this.bindX;
    this.worldY = this.bindY;
  }

  toJSON(): JointData {
    return {
      name: this.name,
      x: this.bindX,
      y: this.bindY,
    };
  }

  static fromJSON(data: JointData): Joint {
    return new Joint(data);
  }
}
