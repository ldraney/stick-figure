import { ActionLibrary, defaultActionLibrary, ActionData } from '../choreography/ActionLibrary';
import { PoseLibrary, defaultPoseLibrary } from '../animation/PoseLibrary';
import { Sequence, SequenceData } from '../choreography/Sequence';
import { BeatData } from '../choreography/Beat';
import { Figure } from '../choreography/Figure';

/**
 * MCP Tool Interface for AI-driven choreography.
 * These functions are designed to be exposed as MCP tools.
 */

export interface ActionListResult {
  actions: Array<{
    name: string;
    category: string;
    duration: number;
  }>;
}

export interface ActionPreviewResult {
  action: ActionData;
  poses: string[];
}

export interface SequencePreviewResult {
  sequence: SequenceData;
  totalDuration: number;
  beatCount: number;
}

export class MCPInterface {
  private poseLibrary: PoseLibrary;
  private actionLibrary: ActionLibrary;
  private sequences: Map<string, Sequence> = new Map();
  private figures: Map<string, Figure> = new Map();

  constructor(
    poseLibrary: PoseLibrary = defaultPoseLibrary,
    actionLibrary: ActionLibrary = defaultActionLibrary
  ) {
    this.poseLibrary = poseLibrary;
    this.actionLibrary = actionLibrary;
  }

  /**
   * MCP Tool: list_actions
   * Returns all available actions in the library.
   */
  listActions(category?: string): ActionListResult {
    let actions = category
      ? this.actionLibrary.getByCategory(category)
      : Array.from(this.actionLibrary.getNames()).map(
          (name) => this.actionLibrary.get(name)!
        );

    return {
      actions: actions.map((a) => ({
        name: a.name,
        category: a.category,
        duration: a.duration,
      })),
    };
  }

  /**
   * MCP Tool: list_poses
   * Returns all available poses in the library.
   */
  listPoses(): { poses: string[] } {
    return { poses: this.poseLibrary.getNames() };
  }

  /**
   * MCP Tool: preview_action
   * Returns details about a specific action.
   */
  previewAction(actionName: string): ActionPreviewResult | null {
    const action = this.actionLibrary.get(actionName);
    if (!action) return null;

    return {
      action: action.toJSON(),
      poses: action.keyframes.map((kf) => kf.pose),
    };
  }

  /**
   * MCP Tool: create_figure
   * Creates a new figure for choreography.
   */
  createFigure(name: string, options?: { facing?: 'left' | 'right'; color?: string }): { success: boolean; figure: string } {
    const figure = new Figure({
      name,
      facing: options?.facing ?? 'right',
      color: options?.color ?? '#00d9ff',
    });
    this.figures.set(name, figure);
    return { success: true, figure: name };
  }

  /**
   * MCP Tool: create_beat
   * Creates a beat for a sequence.
   */
  createBeat(data: BeatData): { success: boolean; beat: BeatData } {
    // Validate actor exists
    if (!this.figures.has(data.actor)) {
      return { success: false, beat: data };
    }
    // Validate action exists
    if (!this.actionLibrary.has(data.action)) {
      return { success: false, beat: data };
    }
    return { success: true, beat: data };
  }

  /**
   * MCP Tool: compose_sequence
   * Creates a sequence from beats.
   */
  composeSequence(
    name: string,
    figureNames: string[],
    beats: BeatData[]
  ): SequencePreviewResult | null {
    // Validate all figures exist
    for (const figureName of figureNames) {
      if (!this.figures.has(figureName)) {
        console.warn(`Figure "${figureName}" not found`);
        return null;
      }
    }

    const sequence = new Sequence(name);

    // Add figures
    for (const figureName of figureNames) {
      const figure = this.figures.get(figureName);
      if (figure) {
        sequence.addFigure(figure);
      }
    }

    // Add beats
    for (const beatData of beats) {
      sequence.createBeat(beatData);
    }

    this.sequences.set(name, sequence);

    return {
      sequence: sequence.toJSON(),
      totalDuration: sequence.getDuration(),
      beatCount: sequence.getBeats().length,
    };
  }

  /**
   * MCP Tool: get_sequence
   * Returns a sequence by name.
   */
  getSequence(name: string): SequencePreviewResult | null {
    const sequence = this.sequences.get(name);
    if (!sequence) return null;

    return {
      sequence: sequence.toJSON(),
      totalDuration: sequence.getDuration(),
      beatCount: sequence.getBeats().length,
    };
  }

  /**
   * MCP Tool: list_sequences
   * Returns all sequence names.
   */
  listSequences(): { sequences: string[] } {
    return { sequences: Array.from(this.sequences.keys()) };
  }

  /**
   * Returns a figure for external use (e.g., rendering).
   */
  getFigure(name: string): Figure | undefined {
    return this.figures.get(name);
  }

  /**
   * Returns a sequence for external use (e.g., playback).
   */
  getSequenceInstance(name: string): Sequence | undefined {
    return this.sequences.get(name);
  }
}

// Singleton for global access
export const mcpInterface = new MCPInterface();
