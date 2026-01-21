import { Action, ActionData } from './Action';
export type { ActionData };

/**
 * Library of predefined actions for fight choreography.
 */
export class ActionLibrary {
  private actions: Map<string, Action> = new Map();

  constructor() {
    this.loadDefaultActions();
  }

  private loadDefaultActions(): void {
    // === ATTACKS ===

    // Jab (quick straight punch)
    this.add(
      new Action({
        name: 'jab',
        duration: 0.3,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.4, pose: 'punch_extend_left', easing: 'power2.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Cross (power straight punch with right)
    this.add(
      new Action({
        name: 'cross',
        duration: 0.4,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.5, pose: 'punch_extend_right', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Hook (left hook punch)
    this.add(
      new Action({
        name: 'hook',
        duration: 0.45,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.25, pose: 'hook_windup_left', easing: 'power2.in' },
          { time: 0.6, pose: 'hook_extend_left', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Hook right
    this.add(
      new Action({
        name: 'hook_right',
        duration: 0.45,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.25, pose: 'hook_windup_right', easing: 'power2.in' },
          { time: 0.6, pose: 'hook_extend_right', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Uppercut
    this.add(
      new Action({
        name: 'uppercut',
        duration: 0.5,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.3, pose: 'uppercut_windup_right', easing: 'power2.in' },
          { time: 0.6, pose: 'uppercut_extend_right', easing: 'power4.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Front kick
    this.add(
      new Action({
        name: 'front_kick',
        duration: 0.5,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.4, pose: 'kick_extend_right', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Roundhouse kick
    this.add(
      new Action({
        name: 'roundhouse',
        duration: 0.6,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.25, pose: 'roundhouse_windup_right', easing: 'power2.in' },
          { time: 0.55, pose: 'roundhouse_extend_right', easing: 'power4.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // === DEFENSE ===

    // Block high
    this.add(
      new Action({
        name: 'block_high',
        duration: 0.2,
        category: 'defense',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power3.out' },
          { time: 0.4, pose: 'block_high', easing: 'power2.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Block low
    this.add(
      new Action({
        name: 'block_low',
        duration: 0.2,
        category: 'defense',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power3.out' },
          { time: 0.4, pose: 'block_low', easing: 'power2.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Parry
    this.add(
      new Action({
        name: 'parry',
        duration: 0.25,
        category: 'defense',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.4, pose: 'parry_left', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Dodge back
    this.add(
      new Action({
        name: 'dodge_back',
        duration: 0.35,
        category: 'defense',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.4, pose: 'dodge_back', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Dodge side (left)
    this.add(
      new Action({
        name: 'dodge_left',
        duration: 0.3,
        category: 'defense',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.4, pose: 'dodge_left', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // Dodge side (right)
    this.add(
      new Action({
        name: 'dodge_right',
        duration: 0.3,
        category: 'defense',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.4, pose: 'dodge_right', easing: 'power3.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // === REACTIONS ===

    // Stagger back (hit reaction)
    this.add(
      new Action({
        name: 'stagger_back',
        duration: 0.4,
        category: 'reaction',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.3, pose: 'stagger_back', easing: 'power2.out' },
          { time: 1, pose: 'guard', easing: 'power1.inOut' },
        ],
      })
    );

    // Stagger side (side hit)
    this.add(
      new Action({
        name: 'stagger_left',
        duration: 0.4,
        category: 'reaction',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.3, pose: 'stagger_left', easing: 'power2.out' },
          { time: 1, pose: 'guard', easing: 'power1.inOut' },
        ],
      })
    );

    this.add(
      new Action({
        name: 'stagger_right',
        duration: 0.4,
        category: 'reaction',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.3, pose: 'stagger_right', easing: 'power2.out' },
          { time: 1, pose: 'guard', easing: 'power1.inOut' },
        ],
      })
    );

    // Knockdown
    this.add(
      new Action({
        name: 'knockdown',
        duration: 0.8,
        category: 'reaction',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power2.in' },
          { time: 0.35, pose: 'knockdown_falling', easing: 'power2.in' },
          { time: 0.7, pose: 'knockdown_ground', easing: 'bounce.out' },
          { time: 1, pose: 'knockdown_ground', easing: 'none' },
        ],
      })
    );

    // Get up
    this.add(
      new Action({
        name: 'get_up',
        duration: 0.7,
        category: 'reaction',
        keyframes: [
          { time: 0, pose: 'knockdown_ground', easing: 'power1.in' },
          { time: 0.5, pose: 'getup_crouch', easing: 'power2.inOut' },
          { time: 1, pose: 'guard', easing: 'power2.out' },
        ],
      })
    );

    // === COMBO ATTACKS ===

    // One-two combo (jab + cross)
    this.add(
      new Action({
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
      })
    );

    // Counter hook (after parry)
    this.add(
      new Action({
        name: 'counter_hook',
        duration: 0.35,
        category: 'attack',
        keyframes: [
          { time: 0, pose: 'parry_left', easing: 'power3.in' },
          { time: 0.5, pose: 'hook_extend_right', easing: 'power4.out' },
          { time: 1, pose: 'guard', easing: 'power2.inOut' },
        ],
      })
    );

    // === TRANSITIONS ===

    // Idle to guard
    this.add(
      new Action({
        name: 'ready',
        duration: 0.3,
        category: 'transition',
        keyframes: [
          { time: 0, pose: 'idle', easing: 'power2.inOut' },
          { time: 1, pose: 'guard', easing: 'power2.out' },
        ],
      })
    );

    // Guard to idle
    this.add(
      new Action({
        name: 'relax',
        duration: 0.4,
        category: 'transition',
        keyframes: [
          { time: 0, pose: 'guard', easing: 'power1.inOut' },
          { time: 1, pose: 'idle', easing: 'power1.out' },
        ],
      })
    );
  }

  /**
   * Adds an action to the library
   */
  add(action: Action): void {
    this.actions.set(action.name, action);
  }

  /**
   * Gets an action by name
   */
  get(name: string): Action | undefined {
    return this.actions.get(name);
  }

  /**
   * Gets all action names
   */
  getNames(): string[] {
    return Array.from(this.actions.keys());
  }

  /**
   * Gets actions by category
   */
  getByCategory(category: string): Action[] {
    return Array.from(this.actions.values()).filter(
      (a) => a.category === category
    );
  }

  /**
   * Gets all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    for (const action of this.actions.values()) {
      categories.add(action.category);
    }
    return Array.from(categories);
  }

  /**
   * Checks if an action exists
   */
  has(name: string): boolean {
    return this.actions.has(name);
  }

  /**
   * Loads actions from JSON data
   */
  loadFromJSON(data: ActionData[]): void {
    for (const actionData of data) {
      this.add(Action.fromJSON(actionData));
    }
  }

  /**
   * Exports all actions to JSON
   */
  toJSON(): ActionData[] {
    return Array.from(this.actions.values()).map((a) => a.toJSON());
  }
}

// Singleton instance
export const defaultActionLibrary = new ActionLibrary();
