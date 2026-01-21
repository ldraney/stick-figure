/**
 * Predefined actions for fight choreography.
 */

import { ActionData } from '../types.js';

export const actions: ActionData[] = [
  // === ATTACKS ===

  // Jab (quick straight punch)
  {
    name: 'jab',
    duration: 0.3,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.4, pose: 'punch_extend_left', easing: 'power2.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Cross (power straight punch with right)
  {
    name: 'cross',
    duration: 0.4,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.5, pose: 'punch_extend_right', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Hook (left hook punch)
  {
    name: 'hook',
    duration: 0.45,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.25, pose: 'hook_windup_left', easing: 'power2.in' },
      { time: 0.6, pose: 'hook_extend_left', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Hook right
  {
    name: 'hook_right',
    duration: 0.45,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.25, pose: 'hook_windup_right', easing: 'power2.in' },
      { time: 0.6, pose: 'hook_extend_right', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Uppercut
  {
    name: 'uppercut',
    duration: 0.5,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.3, pose: 'uppercut_windup_right', easing: 'power2.in' },
      { time: 0.6, pose: 'uppercut_extend_right', easing: 'power4.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Front kick
  {
    name: 'front_kick',
    duration: 0.5,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.4, pose: 'kick_extend_right', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Roundhouse kick
  {
    name: 'roundhouse',
    duration: 0.6,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.25, pose: 'roundhouse_windup_right', easing: 'power2.in' },
      { time: 0.55, pose: 'roundhouse_extend_right', easing: 'power4.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // One-two combo (jab + cross)
  {
    name: 'one_two',
    duration: 0.6,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.2, pose: 'punch_extend_left', easing: 'power2.out' },
      { time: 0.4, pose: 'guard', easing: 'power2.in' },
      { time: 0.7, pose: 'punch_extend_right', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Counter hook (after parry)
  {
    name: 'counter_hook',
    duration: 0.35,
    category: 'attack',
    keyframes: [
      { time: 0, pose: 'parry_left', easing: 'power3.in' },
      { time: 0.5, pose: 'hook_extend_right', easing: 'power4.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // === DEFENSE ===

  // Block high
  {
    name: 'block_high',
    duration: 0.2,
    category: 'defense',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power3.out' },
      { time: 0.4, pose: 'block_high', easing: 'power2.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Block low
  {
    name: 'block_low',
    duration: 0.2,
    category: 'defense',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power3.out' },
      { time: 0.4, pose: 'block_low', easing: 'power2.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Parry
  {
    name: 'parry',
    duration: 0.25,
    category: 'defense',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.4, pose: 'parry_left', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Dodge back
  {
    name: 'dodge_back',
    duration: 0.35,
    category: 'defense',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.4, pose: 'dodge_back', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Dodge side (left)
  {
    name: 'dodge_left',
    duration: 0.3,
    category: 'defense',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.4, pose: 'dodge_left', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // Dodge side (right)
  {
    name: 'dodge_right',
    duration: 0.3,
    category: 'defense',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.4, pose: 'dodge_right', easing: 'power3.out' },
      { time: 1, pose: 'guard', easing: 'power2.inOut' },
    ],
  },

  // === REACTIONS ===

  // Stagger back (hit reaction)
  {
    name: 'stagger_back',
    duration: 0.4,
    category: 'reaction',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.3, pose: 'stagger_back', easing: 'power2.out' },
      { time: 1, pose: 'guard', easing: 'power1.inOut' },
    ],
  },

  // Stagger side (side hit)
  {
    name: 'stagger_left',
    duration: 0.4,
    category: 'reaction',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.3, pose: 'stagger_left', easing: 'power2.out' },
      { time: 1, pose: 'guard', easing: 'power1.inOut' },
    ],
  },

  {
    name: 'stagger_right',
    duration: 0.4,
    category: 'reaction',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.3, pose: 'stagger_right', easing: 'power2.out' },
      { time: 1, pose: 'guard', easing: 'power1.inOut' },
    ],
  },

  // Knockdown
  {
    name: 'knockdown',
    duration: 0.8,
    category: 'reaction',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power2.in' },
      { time: 0.35, pose: 'knockdown_falling', easing: 'power2.in' },
      { time: 0.7, pose: 'knockdown_ground', easing: 'bounce.out' },
      { time: 1, pose: 'knockdown_ground', easing: 'none' },
    ],
  },

  // Get up
  {
    name: 'get_up',
    duration: 0.7,
    category: 'reaction',
    keyframes: [
      { time: 0, pose: 'knockdown_ground', easing: 'power1.in' },
      { time: 0.5, pose: 'getup_crouch', easing: 'power2.inOut' },
      { time: 1, pose: 'guard', easing: 'power2.out' },
    ],
  },

  // === TRANSITIONS ===

  // Idle to guard
  {
    name: 'ready',
    duration: 0.3,
    category: 'transition',
    keyframes: [
      { time: 0, pose: 'idle', easing: 'power2.inOut' },
      { time: 1, pose: 'guard', easing: 'power2.out' },
    ],
  },

  // Guard to idle
  {
    name: 'relax',
    duration: 0.4,
    category: 'transition',
    keyframes: [
      { time: 0, pose: 'guard', easing: 'power1.inOut' },
      { time: 1, pose: 'idle', easing: 'power1.out' },
    ],
  },
];

// Create a map for quick lookup
export const actionMap = new Map(actions.map((a) => [a.name, a]));

export function getAction(name: string): ActionData | undefined {
  return actionMap.get(name);
}

export function getActionNames(): string[] {
  return actions.map((a) => a.name);
}

export function getActionsByCategory(category: string): ActionData[] {
  return actions.filter((a) => a.category === category);
}

export function getCategories(): string[] {
  const categories = new Set<string>();
  for (const action of actions) {
    if (action.category) {
      categories.add(action.category);
    }
  }
  return Array.from(categories);
}

export function hasAction(name: string): boolean {
  return actionMap.has(name);
}
