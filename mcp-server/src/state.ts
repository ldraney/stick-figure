/**
 * In-memory state management for figures and sequences.
 */

import { FigureData, SequenceData, BeatData } from './types.js';

class State {
  private figures: Map<string, FigureData> = new Map();
  private sequences: Map<string, SequenceData> = new Map();

  // === Figure Management ===

  createFigure(
    name: string,
    options: {
      x?: number;
      y?: number;
      facing?: 'left' | 'right';
      color?: string;
    } = {}
  ): FigureData {
    if (this.figures.has(name)) {
      throw new Error(`Figure "${name}" already exists`);
    }

    const figure: FigureData = {
      name,
      x: options.x ?? 0,
      y: options.y ?? 0,
      facing: options.facing ?? 'right',
      color: options.color ?? '#00d9ff',
    };

    this.figures.set(name, figure);
    return figure;
  }

  getFigure(name: string): FigureData | undefined {
    return this.figures.get(name);
  }

  listFigures(): FigureData[] {
    return Array.from(this.figures.values());
  }

  hasFigure(name: string): boolean {
    return this.figures.has(name);
  }

  deleteFigure(name: string): boolean {
    return this.figures.delete(name);
  }

  clearFigures(): void {
    this.figures.clear();
  }

  // === Sequence Management ===

  createSequence(name: string, figures: string[], beats: BeatData[]): SequenceData {
    if (this.sequences.has(name)) {
      throw new Error(`Sequence "${name}" already exists`);
    }

    // Validate figures exist
    for (const figureName of figures) {
      if (!this.figures.has(figureName)) {
        throw new Error(`Figure "${figureName}" does not exist`);
      }
    }

    const sequence: SequenceData = {
      name,
      figures,
      beats,
    };

    this.sequences.set(name, sequence);
    return sequence;
  }

  getSequence(name: string): SequenceData | undefined {
    return this.sequences.get(name);
  }

  listSequences(): SequenceData[] {
    return Array.from(this.sequences.values());
  }

  hasSequence(name: string): boolean {
    return this.sequences.has(name);
  }

  deleteSequence(name: string): boolean {
    return this.sequences.delete(name);
  }

  clearSequences(): void {
    this.sequences.clear();
  }

  // === Bulk Operations ===

  clear(): void {
    this.figures.clear();
    this.sequences.clear();
  }

  getStats(): { figures: number; sequences: number } {
    return {
      figures: this.figures.size,
      sequences: this.sequences.size,
    };
  }
}

// Singleton instance
export const state = new State();
