import { Transform, TransformData } from './Transform';
import { Joint } from './Joint';

/**
 * Represents a bone in the skeleton hierarchy.
 * Bones have a local transform and connect joints.
 */
export interface BoneData {
  name: string;
  length: number;
  parentName?: string;
  jointStart: string;
  jointEnd: string;
  bindTransform?: TransformData;
}

export class Bone {
  readonly name: string;
  readonly length: number;

  // Hierarchy
  parent: Bone | null = null;
  children: Bone[] = [];

  // Joint references (set by Skeleton)
  jointStart: Joint | null = null;
  jointEnd: Joint | null = null;
  readonly jointStartName: string;
  readonly jointEndName: string;
  readonly parentName: string | null;

  // Transform relative to parent (or world if no parent)
  readonly bindTransform: Transform;
  readonly localTransform: Transform;

  // Computed world transform
  worldX: number = 0;
  worldY: number = 0;
  worldRotation: number = 0;

  constructor(data: BoneData) {
    this.name = data.name;
    this.length = data.length;
    this.parentName = data.parentName ?? null;
    this.jointStartName = data.jointStart;
    this.jointEndName = data.jointEnd;
    this.bindTransform = new Transform(data.bindTransform);
    this.localTransform = this.bindTransform.clone();
  }

  /**
   * Adds a child bone
   */
  addChild(bone: Bone): void {
    bone.parent = this;
    this.children.push(bone);
  }

  /**
   * Updates world transform based on parent chain
   */
  updateWorldTransform(): void {
    if (this.parent) {
      // Combine with parent world transform
      const parentRad = (this.parent.worldRotation * Math.PI) / 180;
      const cos = Math.cos(parentRad);
      const sin = Math.sin(parentRad);

      // Apply local transform in parent's coordinate space
      this.worldX =
        this.parent.worldX +
        (this.localTransform.x * cos - this.localTransform.y * sin);
      this.worldY =
        this.parent.worldY +
        (this.localTransform.x * sin + this.localTransform.y * cos);
      this.worldRotation = this.parent.worldRotation + this.localTransform.rotation;
    } else {
      // Root bone - local transform is world transform
      this.worldX = this.localTransform.x;
      this.worldY = this.localTransform.y;
      this.worldRotation = this.localTransform.rotation;
    }

    // Update children
    for (const child of this.children) {
      child.updateWorldTransform();
    }
  }

  /**
   * Gets the end point of this bone based on rotation and length
   */
  getEndPoint(): { x: number; y: number } {
    const rad = (this.worldRotation * Math.PI) / 180;
    return {
      x: this.worldX + Math.cos(rad) * this.length,
      y: this.worldY + Math.sin(rad) * this.length,
    };
  }

  /**
   * Resets local transform to bind pose
   */
  resetToBind(): void {
    this.localTransform.copyFrom(this.bindTransform);
  }

  /**
   * Sets rotation relative to bind pose
   */
  setRotation(angle: number): void {
    this.localTransform.rotation = this.bindTransform.rotation + angle;
  }

  /**
   * Gets rotation relative to bind pose
   */
  getRotation(): number {
    return this.localTransform.rotation - this.bindTransform.rotation;
  }

  toJSON(): BoneData {
    const data: BoneData = {
      name: this.name,
      length: this.length,
      jointStart: this.jointStartName,
      jointEnd: this.jointEndName,
    };
    if (this.parentName) data.parentName = this.parentName;
    const bindData = this.bindTransform.toJSON();
    if (Object.keys(bindData).length > 0) data.bindTransform = bindData;
    return data;
  }

  static fromJSON(data: BoneData): Bone {
    return new Bone(data);
  }
}
