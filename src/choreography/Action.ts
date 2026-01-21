import gsap from 'gsap';
import { Skeleton } from '../core/Skeleton';
import { Pose } from '../animation/Pose';
import { PoseLibrary, defaultPoseLibrary } from '../animation/PoseLibrary';

/**
 * Represents a keyframe in an action.
 */
export interface KeyframeData {
  time: number; // Normalized time (0-1) or absolute time in seconds
  pose: string; // Pose name reference
  easing?: string; // GSAP easing function name
}

/**
 * Action definition data (for JSON serialization).
 */
export interface ActionData {
  name: string;
  duration: number; // Total duration in seconds
  keyframes: KeyframeData[];
  category?: string; // attack, defense, reaction, etc.
}

/**
 * Represents a named animation action that transitions through poses.
 * Actions are the building blocks of the choreography system.
 */
export class Action {
  readonly name: string;
  readonly duration: number;
  readonly keyframes: KeyframeData[];
  readonly category: string;

  constructor(data: ActionData) {
    this.name = data.name;
    this.duration = data.duration;
    this.keyframes = data.keyframes;
    this.category = data.category ?? 'misc';
  }

  /**
   * Creates a GSAP timeline that animates the skeleton through this action.
   * Returns the timeline for external control (play, pause, seek, etc).
   */
  createTimeline(
    skeleton: Skeleton,
    poseLibrary: PoseLibrary = defaultPoseLibrary,
    onUpdate?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline({ paused: true });

    // Get all bones that are affected by any keyframe pose
    const affectedBones = this.getAffectedBones(poseLibrary);

    // For each bone, create tweens between keyframes
    for (const boneName of affectedBones) {
      const bone = skeleton.getBone(boneName);
      if (!bone) continue;

      // Build keyframe values for this bone
      for (let i = 0; i < this.keyframes.length - 1; i++) {
        const fromKf = this.keyframes[i];
        const toKf = this.keyframes[i + 1];

        const fromPose = poseLibrary.get(fromKf.pose);
        const toPose = poseLibrary.get(toKf.pose);

        if (!fromPose || !toPose) continue;

        const fromTransform = fromPose.getBoneTransform(boneName) ?? {};
        const toTransform = toPose.getBoneTransform(boneName) ?? {};

        // Calculate times
        const startTime = fromKf.time * this.duration;
        const segmentDuration = (toKf.time - fromKf.time) * this.duration;

        // Create animation target object
        const target = {
          rotation: fromTransform.rotation ?? 0,
          x: fromTransform.x ?? 0,
          y: fromTransform.y ?? 0,
        };

        // Add to timeline at the correct position
        timeline.to(
          target,
          {
            rotation: toTransform.rotation ?? 0,
            x: toTransform.x ?? 0,
            y: toTransform.y ?? 0,
            duration: segmentDuration,
            ease: toKf.easing ?? 'power2.inOut',
            onUpdate: () => {
              bone.setRotation(target.rotation);
              bone.localTransform.x = bone.bindTransform.x + target.x;
              bone.localTransform.y = bone.bindTransform.y + target.y;
              skeleton.updateTransforms();
              onUpdate?.();
            },
          },
          startTime
        );
      }
    }

    return timeline;
  }

  /**
   * Gets all bone names affected by any keyframe in this action.
   */
  private getAffectedBones(poseLibrary: PoseLibrary): Set<string> {
    const bones = new Set<string>();
    for (const kf of this.keyframes) {
      const pose = poseLibrary.get(kf.pose);
      if (pose) {
        for (const boneName of pose.boneTransforms.keys()) {
          bones.add(boneName);
        }
      }
    }
    return bones;
  }

  /**
   * Gets the pose at a specific time (0-1 normalized).
   * Useful for previewing without animation.
   */
  getPoseAtTime(t: number, poseLibrary: PoseLibrary = defaultPoseLibrary): Pose | null {
    // Find surrounding keyframes
    let fromKf: KeyframeData | null = null;
    let toKf: KeyframeData | null = null;

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (t >= this.keyframes[i].time && t <= this.keyframes[i + 1].time) {
        fromKf = this.keyframes[i];
        toKf = this.keyframes[i + 1];
        break;
      }
    }

    if (!fromKf || !toKf) {
      // Return first or last pose
      const kf = t <= 0 ? this.keyframes[0] : this.keyframes[this.keyframes.length - 1];
      return poseLibrary.get(kf.pose) ?? null;
    }

    const fromPose = poseLibrary.get(fromKf.pose);
    const toPose = poseLibrary.get(toKf.pose);

    if (!fromPose || !toPose) return null;

    // Calculate local t within this segment
    const localT = (t - fromKf.time) / (toKf.time - fromKf.time);

    return fromPose.lerp(toPose, localT);
  }

  toJSON(): ActionData {
    return {
      name: this.name,
      duration: this.duration,
      keyframes: this.keyframes,
      category: this.category,
    };
  }

  static fromJSON(data: ActionData): Action {
    return new Action(data);
  }
}
