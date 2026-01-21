/**
 * Predefined poses for the humanoid skeleton.
 * All rotations are relative to bind pose (0 = bind pose orientation).
 */

import { PoseData } from '../types.js';

export const poses: PoseData[] = [
  // Idle/Neutral stance
  { name: 'idle', boneTransforms: {} },

  // Guard stance - arms up in defensive position
  {
    name: 'guard',
    boneTransforms: {
      'upperArm-left': { rotation: -60 },
      'forearm-left': { rotation: -90 },
      'upperArm-right': { rotation: -60 },
      'forearm-right': { rotation: -90 },
    },
  },

  // Punch extensions
  {
    name: 'punch_extend_left',
    boneTransforms: {
      'upperArm-left': { rotation: -90 },
      'forearm-left': { rotation: 0 },
      'upperArm-right': { rotation: -45 },
      'forearm-right': { rotation: -90 },
      torso: { rotation: 10 },
    },
  },

  {
    name: 'punch_extend_right',
    boneTransforms: {
      'upperArm-right': { rotation: -90 },
      'forearm-right': { rotation: 0 },
      'upperArm-left': { rotation: -45 },
      'forearm-left': { rotation: -90 },
      torso: { rotation: -10 },
    },
  },

  // Hook punch positions
  {
    name: 'hook_windup_left',
    boneTransforms: {
      'upperArm-left': { rotation: -120 },
      'forearm-left': { rotation: -90 },
      torso: { rotation: -20 },
    },
  },

  {
    name: 'hook_extend_left',
    boneTransforms: {
      'upperArm-left': { rotation: -90 },
      'forearm-left': { rotation: -90 },
      torso: { rotation: 30 },
    },
  },

  {
    name: 'hook_windup_right',
    boneTransforms: {
      'upperArm-right': { rotation: -120 },
      'forearm-right': { rotation: -90 },
      torso: { rotation: 20 },
    },
  },

  {
    name: 'hook_extend_right',
    boneTransforms: {
      'upperArm-right': { rotation: -90 },
      'forearm-right': { rotation: -90 },
      torso: { rotation: -30 },
    },
  },

  // Uppercut positions
  {
    name: 'uppercut_windup_left',
    boneTransforms: {
      'upperArm-left': { rotation: 20 },
      'forearm-left': { rotation: -120 },
      torso: { rotation: -15 },
      spine: { rotation: 10 },
    },
  },

  {
    name: 'uppercut_extend_left',
    boneTransforms: {
      'upperArm-left': { rotation: -120 },
      'forearm-left': { rotation: -60 },
      torso: { rotation: 10 },
      spine: { rotation: -5 },
    },
  },

  {
    name: 'uppercut_windup_right',
    boneTransforms: {
      'upperArm-right': { rotation: 20 },
      'forearm-right': { rotation: -120 },
      torso: { rotation: 15 },
      spine: { rotation: 10 },
    },
  },

  {
    name: 'uppercut_extend_right',
    boneTransforms: {
      'upperArm-right': { rotation: -120 },
      'forearm-right': { rotation: -60 },
      torso: { rotation: -10 },
      spine: { rotation: -5 },
    },
  },

  // Kick extensions
  {
    name: 'kick_extend_left',
    boneTransforms: {
      'thigh-left': { rotation: -90 },
      'shin-left': { rotation: 20 },
      'thigh-right': { rotation: 10 },
    },
  },

  {
    name: 'kick_extend_right',
    boneTransforms: {
      'thigh-right': { rotation: -90 },
      'shin-right': { rotation: 20 },
      'thigh-left': { rotation: 10 },
    },
  },

  // Roundhouse kick
  {
    name: 'roundhouse_windup_right',
    boneTransforms: {
      'thigh-right': { rotation: 45 },
      'shin-right': { rotation: -90 },
      torso: { rotation: -30 },
    },
  },

  {
    name: 'roundhouse_extend_right',
    boneTransforms: {
      'thigh-right': { rotation: -60 },
      'shin-right': { rotation: 0 },
      torso: { rotation: 20 },
    },
  },

  // Block poses
  {
    name: 'block_high',
    boneTransforms: {
      'upperArm-left': { rotation: -120 },
      'forearm-left': { rotation: -45 },
      'upperArm-right': { rotation: -120 },
      'forearm-right': { rotation: -45 },
    },
  },

  {
    name: 'block_low',
    boneTransforms: {
      'upperArm-left': { rotation: -30 },
      'forearm-left': { rotation: -60 },
      'upperArm-right': { rotation: -30 },
      'forearm-right': { rotation: -60 },
    },
  },

  // Parry
  {
    name: 'parry_left',
    boneTransforms: {
      'upperArm-left': { rotation: -100 },
      'forearm-left': { rotation: -30 },
      torso: { rotation: 15 },
    },
  },

  {
    name: 'parry_right',
    boneTransforms: {
      'upperArm-right': { rotation: -100 },
      'forearm-right': { rotation: -30 },
      torso: { rotation: -15 },
    },
  },

  // Dodge poses
  {
    name: 'dodge_back',
    boneTransforms: {
      spine: { rotation: 20, y: 10 },
      torso: { rotation: 15 },
      'thigh-left': { rotation: 15 },
      'thigh-right': { rotation: 15 },
    },
  },

  {
    name: 'dodge_left',
    boneTransforms: {
      spine: { x: -20 },
      torso: { rotation: 20 },
    },
  },

  {
    name: 'dodge_right',
    boneTransforms: {
      spine: { x: 20 },
      torso: { rotation: -20 },
    },
  },

  // Stagger reactions
  {
    name: 'stagger_back',
    boneTransforms: {
      spine: { rotation: 25, x: -15 },
      torso: { rotation: 15 },
      neck: { rotation: 10 },
      'upperArm-left': { rotation: 30 },
      'upperArm-right': { rotation: 30 },
    },
  },

  {
    name: 'stagger_left',
    boneTransforms: {
      spine: { x: -25 },
      torso: { rotation: 25 },
      neck: { rotation: 15 },
    },
  },

  {
    name: 'stagger_right',
    boneTransforms: {
      spine: { x: 25 },
      torso: { rotation: -25 },
      neck: { rotation: -15 },
    },
  },

  // Knockdown sequence
  {
    name: 'knockdown_falling',
    boneTransforms: {
      spine: { rotation: 45, y: 30 },
      torso: { rotation: 30 },
      neck: { rotation: 20 },
      'upperArm-left': { rotation: 60 },
      'upperArm-right': { rotation: 60 },
      'thigh-left': { rotation: -30 },
      'thigh-right': { rotation: -30 },
    },
  },

  {
    name: 'knockdown_ground',
    boneTransforms: {
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
    },
  },

  // Get up sequence
  {
    name: 'getup_crouch',
    boneTransforms: {
      spine: { rotation: 45, y: 40 },
      torso: { rotation: -20 },
      'thigh-left': { rotation: -60 },
      'shin-left': { rotation: 90 },
      'thigh-right': { rotation: -60 },
      'shin-right': { rotation: 90 },
      'upperArm-left': { rotation: -30 },
      'upperArm-right': { rotation: -30 },
    },
  },
];

// Create a map for quick lookup
export const poseMap = new Map(poses.map((p) => [p.name, p]));

export function getPose(name: string): PoseData | undefined {
  return poseMap.get(name);
}

export function getPoseNames(): string[] {
  return poses.map((p) => p.name);
}

export function hasPose(name: string): boolean {
  return poseMap.has(name);
}
