import gsap from 'gsap';
import { Figure } from './Figure';
import { Beat, BeatData } from './Beat';
import { ActionLibrary, defaultActionLibrary } from './ActionLibrary';

/**
 * Sequence data for JSON serialization.
 */
export interface SequenceData {
  name?: string;
  figures: string[]; // Figure names in this sequence
  beats: BeatData[];
}

/**
 * Orchestrates multiple figures performing beats in sequence.
 * This is the main composition layer for fight choreography.
 */
export class Sequence {
  name: string;
  private figures: Map<string, Figure> = new Map();
  private beats: Beat[] = [];
  private masterTimeline: gsap.core.Timeline | null = null;
  private actionLibrary: ActionLibrary;

  // Callbacks
  private onBeatStart?: (beat: Beat) => void;
  private onComplete?: () => void;

  constructor(name: string = 'sequence') {
    this.name = name;
    this.actionLibrary = defaultActionLibrary;
  }

  /**
   * Adds a figure to this sequence.
   */
  addFigure(figure: Figure): void {
    this.figures.set(figure.name, figure);
  }

  /**
   * Gets a figure by name.
   */
  getFigure(name: string): Figure | undefined {
    return this.figures.get(name);
  }

  /**
   * Adds a beat to the sequence.
   */
  addBeat(beat: Beat): void {
    this.beats.push(beat);
    // Keep sorted by time
    this.beats.sort((a, b) => a.time - b.time);
  }

  /**
   * Creates a beat and adds it to the sequence.
   */
  createBeat(data: BeatData): Beat {
    const beat = new Beat(data);
    this.addBeat(beat);
    return beat;
  }

  /**
   * Gets all beats.
   */
  getBeats(): Beat[] {
    return [...this.beats];
  }

  /**
   * Removes a beat by index.
   */
  removeBeat(index: number): void {
    this.beats.splice(index, 1);
  }

  /**
   * Clears all beats.
   */
  clearBeats(): void {
    this.beats = [];
  }

  /**
   * Calculates the total duration of the sequence.
   */
  getDuration(): number {
    if (this.beats.length === 0) return 0;

    let maxEnd = 0;
    for (const beat of this.beats) {
      const action = this.actionLibrary.get(beat.action);
      if (action) {
        const end = beat.time + action.duration;
        maxEnd = Math.max(maxEnd, end);
      }
    }
    return maxEnd;
  }

  /**
   * Builds the master timeline from all beats.
   */
  build(): gsap.core.Timeline {
    // Kill existing timeline
    if (this.masterTimeline) {
      this.masterTimeline.kill();
    }

    this.masterTimeline = gsap.timeline({
      paused: true,
      onComplete: () => this.onComplete?.(),
    });

    // Add each beat to the timeline
    for (const beat of this.beats) {
      const figure = this.figures.get(beat.actor);
      if (!figure) {
        console.warn(`Figure "${beat.actor}" not found in sequence`);
        continue;
      }

      const action = this.actionLibrary.get(beat.action);
      if (!action) {
        console.warn(`Action "${beat.action}" not found`);
        continue;
      }

      // Create action timeline for this figure
      const actionTimeline = figure.perform(beat.action);
      if (!actionTimeline) continue;

      // Add beat start callback
      this.masterTimeline.call(
        () => this.onBeatStart?.(beat),
        [],
        beat.time
      );

      // Add action timeline at the beat's start time
      this.masterTimeline.add(actionTimeline, beat.time);
    }

    return this.masterTimeline;
  }

  /**
   * Builds and plays the sequence.
   */
  play(): void {
    this.build();
    this.masterTimeline?.play(0);
  }

  /**
   * Pauses playback.
   */
  pause(): void {
    this.masterTimeline?.pause();
  }

  /**
   * Resumes playback.
   */
  resume(): void {
    this.masterTimeline?.resume();
  }

  /**
   * Stops and resets all figures.
   */
  stop(): void {
    this.masterTimeline?.pause();
    this.masterTimeline?.seek(0);
    for (const figure of this.figures.values()) {
      figure.stop();
    }
  }

  /**
   * Seeks to a specific time.
   */
  seek(time: number): void {
    if (!this.masterTimeline) {
      this.build();
    }
    this.masterTimeline?.seek(time);
  }

  /**
   * Seeks to a normalized progress (0-1).
   */
  seekProgress(progress: number): void {
    if (!this.masterTimeline) {
      this.build();
    }
    this.masterTimeline?.progress(progress);
  }

  /**
   * Gets current playback time.
   */
  getTime(): number {
    return this.masterTimeline?.time() ?? 0;
  }

  /**
   * Gets current progress (0-1).
   */
  getProgress(): number {
    return this.masterTimeline?.progress() ?? 0;
  }

  /**
   * Checks if currently playing.
   */
  isPlaying(): boolean {
    return this.masterTimeline?.isActive() ?? false;
  }

  /**
   * Sets callback for beat start events.
   */
  setOnBeatStart(callback: (beat: Beat) => void): void {
    this.onBeatStart = callback;
  }

  /**
   * Sets callback for sequence completion.
   */
  setOnComplete(callback: () => void): void {
    this.onComplete = callback;
  }

  /**
   * Sets the action library.
   */
  setActionLibrary(library: ActionLibrary): void {
    this.actionLibrary = library;
  }

  /**
   * Creates a sample fight exchange sequence.
   */
  static createSampleFight(figureA: Figure, figureB: Figure): Sequence {
    const sequence = new Sequence('sample_fight');
    sequence.addFigure(figureA);
    sequence.addFigure(figureB);

    // A jabs at B
    sequence.createBeat({
      time: 0,
      actor: figureA.name,
      action: 'jab',
      target: figureB.name,
    });

    // B blocks high
    sequence.createBeat({
      time: 0.1,
      actor: figureB.name,
      action: 'block_high',
    });

    // B counters with hook
    sequence.createBeat({
      time: 0.4,
      actor: figureB.name,
      action: 'hook',
      target: figureA.name,
    });

    // A staggers
    sequence.createBeat({
      time: 0.55,
      actor: figureA.name,
      action: 'stagger_back',
    });

    // A recovers and throws cross
    sequence.createBeat({
      time: 1.0,
      actor: figureA.name,
      action: 'cross',
      target: figureB.name,
    });

    // B dodges
    sequence.createBeat({
      time: 1.1,
      actor: figureB.name,
      action: 'dodge_left',
    });

    return sequence;
  }

  toJSON(): SequenceData {
    return {
      name: this.name,
      figures: Array.from(this.figures.keys()),
      beats: this.beats.map((b) => b.toJSON()),
    };
  }

  static fromJSON(data: SequenceData, figures: Map<string, Figure>): Sequence {
    const sequence = new Sequence(data.name);
    for (const figureName of data.figures) {
      const figure = figures.get(figureName);
      if (figure) {
        sequence.addFigure(figure);
      }
    }
    for (const beatData of data.beats) {
      sequence.addBeat(Beat.fromJSON(beatData));
    }
    return sequence;
  }
}
