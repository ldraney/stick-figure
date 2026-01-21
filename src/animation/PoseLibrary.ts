import { Pose, PoseData } from './Pose';
export type { PoseData };

/**
 * Library of predefined poses for the humanoid skeleton.
 * All rotations are relative to bind pose (0 = bind pose orientation).
 */
export class PoseLibrary {
  private poses: Map<string, Pose> = new Map();

  constructor() {
    this.loadDefaultPoses();
  }

  private loadDefaultPoses(): void {
    // Idle/Neutral stance
    this.add(new Pose('idle', {}));

    // Guard stance - arms up in defensive position
    this.add(
      new Pose('guard', {
        'upperArm-left': { rotation: -60 },
        'forearm-left': { rotation: -90 },
        'upperArm-right': { rotation: -60 },
        'forearm-right': { rotation: -90 },
      })
    );

    // Punch extensions
    this.add(
      new Pose('punch_extend_left', {
        'upperArm-left': { rotation: -90 },
        'forearm-left': { rotation: 0 },
        'upperArm-right': { rotation: -45 },
        'forearm-right': { rotation: -90 },
        torso: { rotation: 10 },
      })
    );

    this.add(
      new Pose('punch_extend_right', {
        'upperArm-right': { rotation: -90 },
        'forearm-right': { rotation: 0 },
        'upperArm-left': { rotation: -45 },
        'forearm-left': { rotation: -90 },
        torso: { rotation: -10 },
      })
    );

    // Hook punch positions
    this.add(
      new Pose('hook_windup_left', {
        'upperArm-left': { rotation: -120 },
        'forearm-left': { rotation: -90 },
        torso: { rotation: -20 },
      })
    );

    this.add(
      new Pose('hook_extend_left', {
        'upperArm-left': { rotation: -90 },
        'forearm-left': { rotation: -90 },
        torso: { rotation: 30 },
      })
    );

    this.add(
      new Pose('hook_windup_right', {
        'upperArm-right': { rotation: -120 },
        'forearm-right': { rotation: -90 },
        torso: { rotation: 20 },
      })
    );

    this.add(
      new Pose('hook_extend_right', {
        'upperArm-right': { rotation: -90 },
        'forearm-right': { rotation: -90 },
        torso: { rotation: -30 },
      })
    );

    // Uppercut positions
    this.add(
      new Pose('uppercut_windup_left', {
        'upperArm-left': { rotation: 20 },
        'forearm-left': { rotation: -120 },
        torso: { rotation: -15 },
        spine: { rotation: 10 },
      })
    );

    this.add(
      new Pose('uppercut_extend_left', {
        'upperArm-left': { rotation: -120 },
        'forearm-left': { rotation: -60 },
        torso: { rotation: 10 },
        spine: { rotation: -5 },
      })
    );

    this.add(
      new Pose('uppercut_windup_right', {
        'upperArm-right': { rotation: 20 },
        'forearm-right': { rotation: -120 },
        torso: { rotation: 15 },
        spine: { rotation: 10 },
      })
    );

    this.add(
      new Pose('uppercut_extend_right', {
        'upperArm-right': { rotation: -120 },
        'forearm-right': { rotation: -60 },
        torso: { rotation: -10 },
        spine: { rotation: -5 },
      })
    );

    // Kick extensions
    this.add(
      new Pose('kick_extend_left', {
        'thigh-left': { rotation: -90 },
        'shin-left': { rotation: 20 },
        'thigh-right': { rotation: 10 },
      })
    );

    this.add(
      new Pose('kick_extend_right', {
        'thigh-right': { rotation: -90 },
        'shin-right': { rotation: 20 },
        'thigh-left': { rotation: 10 },
      })
    );

    // Roundhouse kick
    this.add(
      new Pose('roundhouse_windup_right', {
        'thigh-right': { rotation: 45 },
        'shin-right': { rotation: -90 },
        torso: { rotation: -30 },
      })
    );

    this.add(
      new Pose('roundhouse_extend_right', {
        'thigh-right': { rotation: -60 },
        'shin-right': { rotation: 0 },
        torso: { rotation: 20 },
      })
    );

    // Block poses
    this.add(
      new Pose('block_high', {
        'upperArm-left': { rotation: -120 },
        'forearm-left': { rotation: -45 },
        'upperArm-right': { rotation: -120 },
        'forearm-right': { rotation: -45 },
      })
    );

    this.add(
      new Pose('block_low', {
        'upperArm-left': { rotation: -30 },
        'forearm-left': { rotation: -60 },
        'upperArm-right': { rotation: -30 },
        'forearm-right': { rotation: -60 },
      })
    );

    // Parry
    this.add(
      new Pose('parry_left', {
        'upperArm-left': { rotation: -100 },
        'forearm-left': { rotation: -30 },
        torso: { rotation: 15 },
      })
    );

    this.add(
      new Pose('parry_right', {
        'upperArm-right': { rotation: -100 },
        'forearm-right': { rotation: -30 },
        torso: { rotation: -15 },
      })
    );

    // Dodge poses
    this.add(
      new Pose('dodge_back', {
        spine: { rotation: 20, y: 10 },
        torso: { rotation: 15 },
        'thigh-left': { rotation: 15 },
        'thigh-right': { rotation: 15 },
      })
    );

    this.add(
      new Pose('dodge_left', {
        spine: { x: -20 },
        torso: { rotation: 20 },
      })
    );

    this.add(
      new Pose('dodge_right', {
        spine: { x: 20 },
        torso: { rotation: -20 },
      })
    );

    // Stagger reactions
    this.add(
      new Pose('stagger_back', {
        spine: { rotation: 25, x: -15 },
        torso: { rotation: 15 },
        neck: { rotation: 10 },
        'upperArm-left': { rotation: 30 },
        'upperArm-right': { rotation: 30 },
      })
    );

    this.add(
      new Pose('stagger_left', {
        spine: { x: -25 },
        torso: { rotation: 25 },
        neck: { rotation: 15 },
      })
    );

    this.add(
      new Pose('stagger_right', {
        spine: { x: 25 },
        torso: { rotation: -25 },
        neck: { rotation: -15 },
      })
    );

    // Knockdown sequence
    this.add(
      new Pose('knockdown_falling', {
        spine: { rotation: 45, y: 30 },
        torso: { rotation: 30 },
        neck: { rotation: 20 },
        'upperArm-left': { rotation: 60 },
        'upperArm-right': { rotation: 60 },
        'thigh-left': { rotation: -30 },
        'thigh-right': { rotation: -30 },
      })
    );

    this.add(
      new Pose('knockdown_ground', {
        spine: { rotation: 90, y: 80 },
        torso: { rotation: 0 },
        neck: { rotation: -10 },
        'upperArm-left': { rotation: 90 },
        'forearm-left': { rotation: 45 },
        'upperArm-right': { rotation: 90 },
        'forearm-right': { rotation: 45 },
        'thigh-left': { rotation: -90 },
        'shin-left': { rotation: 45 },
        'thigh-right': { rotation: -90 },
        'shin-right': { rotation: 45 },
      })
    );

    // Get up sequence
    this.add(
      new Pose('getup_crouch', {
        spine: { rotation: 45, y: 40 },
        torso: { rotation: -20 },
        'thigh-left': { rotation: -60 },
        'shin-left': { rotation: 90 },
        'thigh-right': { rotation: -60 },
        'shin-right': { rotation: 90 },
        'upperArm-left': { rotation: -30 },
        'upperArm-right': { rotation: -30 },
      })
    );
  }

  /**
   * Adds a pose to the library
   */
  add(pose: Pose): void {
    this.poses.set(pose.name, pose);
  }

  /**
   * Gets a pose by name
   */
  get(name: string): Pose | undefined {
    return this.poses.get(name);
  }

  /**
   * Gets all pose names
   */
  getNames(): string[] {
    return Array.from(this.poses.keys());
  }

  /**
   * Checks if a pose exists
   */
  has(name: string): boolean {
    return this.poses.has(name);
  }

  /**
   * Loads poses from JSON data
   */
  loadFromJSON(data: PoseData[]): void {
    for (const poseData of data) {
      this.add(Pose.fromJSON(poseData));
    }
  }

  /**
   * Exports all poses to JSON
   */
  toJSON(): PoseData[] {
    return Array.from(this.poses.values()).map((p) => p.toJSON());
  }
}

// Singleton instance
export const defaultPoseLibrary = new PoseLibrary();
