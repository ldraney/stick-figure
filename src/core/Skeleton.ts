import { Bone, BoneData } from './Bone';
import { Joint, JointData } from './Joint';

/**
 * Central skeleton manager containing bones and joints.
 * Handles hierarchy, transform updates, and provides the default humanoid rig.
 */
export interface SkeletonData {
  joints: JointData[];
  bones: BoneData[];
}

export class Skeleton {
  readonly joints: Map<string, Joint> = new Map();
  readonly bones: Map<string, Bone> = new Map();
  readonly rootBones: Bone[] = [];

  constructor(data?: SkeletonData) {
    if (data) {
      this.loadFromData(data);
    }
  }

  private loadFromData(data: SkeletonData): void {
    // Create joints
    for (const jointData of data.joints) {
      const joint = new Joint(jointData);
      this.joints.set(joint.name, joint);
    }

    // Create bones
    for (const boneData of data.bones) {
      const bone = new Bone(boneData);
      // Link joints
      bone.jointStart = this.joints.get(bone.jointStartName) ?? null;
      bone.jointEnd = this.joints.get(bone.jointEndName) ?? null;
      this.bones.set(bone.name, bone);
    }

    // Build hierarchy
    for (const bone of this.bones.values()) {
      if (bone.parentName) {
        const parent = this.bones.get(bone.parentName);
        if (parent) {
          parent.addChild(bone);
        }
      } else {
        this.rootBones.push(bone);
      }
    }
  }

  /**
   * Updates all bone world transforms starting from root bones
   */
  updateTransforms(): void {
    for (const root of this.rootBones) {
      root.updateWorldTransform();
    }
  }

  /**
   * Resets all bones to bind pose
   */
  resetToBind(): void {
    for (const bone of this.bones.values()) {
      bone.resetToBind();
    }
    this.updateTransforms();
  }

  /**
   * Gets a bone by name
   */
  getBone(name: string): Bone | undefined {
    return this.bones.get(name);
  }

  /**
   * Gets a joint by name
   */
  getJoint(name: string): Joint | undefined {
    return this.joints.get(name);
  }

  /**
   * Gets all bone names
   */
  getBoneNames(): string[] {
    return Array.from(this.bones.keys());
  }

  /**
   * Creates the default humanoid stick figure skeleton.
   * 16 joints, 14 bones arranged in a hierarchical structure.
   */
  static createHumanoid(): Skeleton {
    // All positions are relative to a center point at the hips
    // Y-axis: positive is down (SVG convention)
    const data: SkeletonData = {
      joints: [
        // Head/Torso (center line)
        { name: 'head', x: 0, y: -140 },
        { name: 'neck', x: 0, y: -110 },
        { name: 'spine', x: 0, y: -50 },
        { name: 'hips', x: 0, y: 0 },

        // Left arm
        { name: 'shoulder-left', x: -20, y: -100 },
        { name: 'elbow-left', x: -50, y: -100 },
        { name: 'wrist-left', x: -80, y: -100 },

        // Right arm
        { name: 'shoulder-right', x: 20, y: -100 },
        { name: 'elbow-right', x: 50, y: -100 },
        { name: 'wrist-right', x: 80, y: -100 },

        // Left leg
        { name: 'hip-left', x: -15, y: 0 },
        { name: 'knee-left', x: -15, y: 50 },
        { name: 'ankle-left', x: -15, y: 100 },

        // Right leg
        { name: 'hip-right', x: 15, y: 0 },
        { name: 'knee-right', x: 15, y: 50 },
        { name: 'ankle-right', x: 15, y: 100 },
      ],
      bones: [
        // Spine chain (root)
        {
          name: 'spine',
          length: 50,
          jointStart: 'hips',
          jointEnd: 'spine',
          bindTransform: { rotation: -90 }, // Points up
        },
        {
          name: 'torso',
          length: 50,
          parentName: 'spine',
          jointStart: 'spine',
          jointEnd: 'neck',
          bindTransform: { rotation: 0 },
        },
        {
          name: 'neck',
          length: 30,
          parentName: 'torso',
          jointStart: 'neck',
          jointEnd: 'head',
          bindTransform: { rotation: 0 },
        },

        // Left arm chain
        {
          name: 'upperArm-left',
          length: 30,
          parentName: 'torso',
          jointStart: 'shoulder-left',
          jointEnd: 'elbow-left',
          bindTransform: { x: -20, y: 10, rotation: 90 }, // Points left/down
        },
        {
          name: 'forearm-left',
          length: 30,
          parentName: 'upperArm-left',
          jointStart: 'elbow-left',
          jointEnd: 'wrist-left',
          bindTransform: { rotation: 0 },
        },

        // Right arm chain
        {
          name: 'upperArm-right',
          length: 30,
          parentName: 'torso',
          jointStart: 'shoulder-right',
          jointEnd: 'elbow-right',
          bindTransform: { x: 20, y: 10, rotation: 90 }, // Points right/down
        },
        {
          name: 'forearm-right',
          length: 30,
          parentName: 'upperArm-right',
          jointStart: 'elbow-right',
          jointEnd: 'wrist-right',
          bindTransform: { rotation: 0 },
        },

        // Left leg chain (offsets account for parent's -90 rotation)
        {
          name: 'thigh-left',
          length: 50,
          parentName: 'spine',
          jointStart: 'hip-left',
          jointEnd: 'knee-left',
          bindTransform: { x: 0, y: -15, rotation: 180 }, // Points down
        },
        {
          name: 'shin-left',
          length: 50,
          parentName: 'thigh-left',
          jointStart: 'knee-left',
          jointEnd: 'ankle-left',
          bindTransform: { rotation: 0 },
        },

        // Right leg chain (offsets account for parent's -90 rotation)
        {
          name: 'thigh-right',
          length: 50,
          parentName: 'spine',
          jointStart: 'hip-right',
          jointEnd: 'knee-right',
          bindTransform: { x: 0, y: 15, rotation: 180 }, // Points down
        },
        {
          name: 'shin-right',
          length: 50,
          parentName: 'thigh-right',
          jointStart: 'knee-right',
          jointEnd: 'ankle-right',
          bindTransform: { rotation: 0 },
        },
      ],
    };

    const skeleton = new Skeleton(data);
    skeleton.updateTransforms();
    return skeleton;
  }

  toJSON(): SkeletonData {
    return {
      joints: Array.from(this.joints.values()).map((j) => j.toJSON()),
      bones: Array.from(this.bones.values()).map((b) => b.toJSON()),
    };
  }

  static fromJSON(data: SkeletonData): Skeleton {
    return new Skeleton(data);
  }
}
