/**
 * Represents a moment of interaction in a fight sequence.
 * Beats are the building blocks of choreographed sequences.
 */
export interface BeatData {
  time: number; // Start time in seconds
  actor: string; // Figure name performing the action
  action: string; // Action name to perform
  target?: string; // Optional target figure (for hits/blocks)
}

export class Beat {
  readonly time: number;
  readonly actor: string;
  readonly action: string;
  readonly target: string | null;

  constructor(data: BeatData) {
    this.time = data.time;
    this.actor = data.actor;
    this.action = data.action;
    this.target = data.target ?? null;
  }

  /**
   * Creates a copy with modified properties.
   */
  with(changes: Partial<BeatData>): Beat {
    return new Beat({
      time: changes.time ?? this.time,
      actor: changes.actor ?? this.actor,
      action: changes.action ?? this.action,
      target: changes.target ?? this.target ?? undefined,
    });
  }

  /**
   * Returns a time-shifted copy of this beat.
   */
  shift(deltaTime: number): Beat {
    return this.with({ time: this.time + deltaTime });
  }

  toJSON(): BeatData {
    const data: BeatData = {
      time: this.time,
      actor: this.actor,
      action: this.action,
    };
    if (this.target) data.target = this.target;
    return data;
  }

  static fromJSON(data: BeatData): Beat {
    return new Beat(data);
  }
}
