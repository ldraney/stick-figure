/**
 * Types for stick figure choreography MCP server.
 * Copied from main project to keep server self-contained.
 */

// Pose types
export interface BoneTransformData {
  rotation?: number;
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface PoseData {
  name: string;
  boneTransforms: Record<string, BoneTransformData>;
}

// Action types
export interface KeyframeData {
  time: number;
  pose: string;
  easing?: string;
}

export interface ActionData {
  name: string;
  duration: number;
  keyframes: KeyframeData[];
  category?: string;
}

// Beat types
export interface BeatData {
  time: number;
  actor: string;
  action: string;
  target?: string;
}

// Figure types
export interface FigureData {
  name: string;
  x: number;
  y: number;
  facing: 'left' | 'right';
  color: string;
}

// Sequence types
export interface SequenceData {
  name: string;
  figures: string[];
  beats: BeatData[];
}

// Export format for browser import
export interface ExportedSequence {
  version: string;
  exportedAt: string;
  sequence: SequenceData;
  figures: FigureData[];
}
