import { Skeleton } from '../core/Skeleton';

/**
 * Represents a snapshot of bone transforms.
 * Can be applied to a skeleton and interpolated with other poses.
 */
export interface BoneTransformData {
  rotation?: number;
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface PoseData {
  name: string;
  boneTransforms: Record<string, BoneTransformData>;
}

export class Pose {
  readonly name: string;
  readonly boneTransforms: Map<string, BoneTransformData>;

  constructor(name: string, transforms: Record<string, BoneTransformData> = {}) {
    this.name = name;
    this.boneTransforms = new Map(Object.entries(transforms));
  }

  /**
   * Applies this pose to a skeleton (modifies bone local transforms)
   */
  applyTo(skeleton: Skeleton): void {
    for (const [boneName, transform] of this.boneTransforms) {
      const bone = skeleton.getBone(boneName);
      if (bone) {
        if (transform.rotation !== undefined) {
          bone.setRotation(transform.rotation);
        }
        if (transform.x !== undefined) {
          bone.localTransform.x = bone.bindTransform.x + transform.x;
        }
        if (transform.y !== undefined) {
          bone.localTransform.y = bone.bindTransform.y + transform.y;
        }
        if (transform.scaleX !== undefined) {
          bone.localTransform.scaleX = transform.scaleX;
        }
        if (transform.scaleY !== undefined) {
          bone.localTransform.scaleY = transform.scaleY;
        }
      }
    }
    skeleton.updateTransforms();
  }

  /**
   * Gets the transform data for a specific bone
   */
  getBoneTransform(boneName: string): BoneTransformData | undefined {
    return this.boneTransforms.get(boneName);
  }

  /**
   * Sets the transform data for a specific bone
   */
  setBoneTransform(boneName: string, transform: BoneTransformData): void {
    this.boneTransforms.set(boneName, transform);
  }

  /**
   * Creates a new pose by linearly interpolating between this pose and another
   */
  lerp(target: Pose, t: number): Pose {
    const result = new Pose(`${this.name}_to_${target.name}_${t.toFixed(2)}`);

    // Get all bone names from both poses
    const allBones = new Set([
      ...this.boneTransforms.keys(),
      ...target.boneTransforms.keys(),
    ]);

    for (const boneName of allBones) {
      const from = this.boneTransforms.get(boneName) ?? {};
      const to = target.boneTransforms.get(boneName) ?? {};

      const interpolated: BoneTransformData = {};

      // Interpolate each property if present in either pose
      if (from.rotation !== undefined || to.rotation !== undefined) {
        interpolated.rotation = this.lerpAngle(
          from.rotation ?? 0,
          to.rotation ?? 0,
          t
        );
      }
      if (from.x !== undefined || to.x !== undefined) {
        interpolated.x = this.lerpValue(from.x ?? 0, to.x ?? 0, t);
      }
      if (from.y !== undefined || to.y !== undefined) {
        interpolated.y = this.lerpValue(from.y ?? 0, to.y ?? 0, t);
      }
      if (from.scaleX !== undefined || to.scaleX !== undefined) {
        interpolated.scaleX = this.lerpValue(from.scaleX ?? 1, to.scaleX ?? 1, t);
      }
      if (from.scaleY !== undefined || to.scaleY !== undefined) {
        interpolated.scaleY = this.lerpValue(from.scaleY ?? 1, to.scaleY ?? 1, t);
      }

      if (Object.keys(interpolated).length > 0) {
        result.boneTransforms.set(boneName, interpolated);
      }
    }

    return result;
  }

  private lerpValue(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private lerpAngle(a: number, b: number, t: number): number {
    let diff = b - a;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    return a + diff * t;
  }

  /**
   * Creates a pose that represents the difference between two poses
   */
  static difference(from: Pose, to: Pose): Pose {
    const result = new Pose(`diff_${from.name}_${to.name}`);

    for (const [boneName, toTransform] of to.boneTransforms) {
      const fromTransform = from.boneTransforms.get(boneName) ?? {};
      const diff: BoneTransformData = {};

      if (toTransform.rotation !== undefined) {
        diff.rotation = toTransform.rotation - (fromTransform.rotation ?? 0);
      }
      if (toTransform.x !== undefined) {
        diff.x = toTransform.x - (fromTransform.x ?? 0);
      }
      if (toTransform.y !== undefined) {
        diff.y = toTransform.y - (fromTransform.y ?? 0);
      }

      result.boneTransforms.set(boneName, diff);
    }

    return result;
  }

  /**
   * Creates a copy of this pose
   */
  clone(): Pose {
    const cloned = new Pose(this.name);
    for (const [boneName, transform] of this.boneTransforms) {
      cloned.boneTransforms.set(boneName, { ...transform });
    }
    return cloned;
  }

  toJSON(): PoseData {
    const transforms: Record<string, BoneTransformData> = {};
    for (const [name, data] of this.boneTransforms) {
      transforms[name] = { ...data };
    }
    return {
      name: this.name,
      boneTransforms: transforms,
    };
  }

  static fromJSON(data: PoseData): Pose {
    return new Pose(data.name, data.boneTransforms);
  }
}
