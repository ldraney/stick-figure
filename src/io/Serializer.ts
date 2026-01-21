import { PoseData, PoseLibrary } from '../animation';
import { ActionData, ActionLibrary, Sequence, SequenceData, Figure } from '../choreography';

/**
 * Project data for full save/load
 */
export interface ProjectData {
  version: string;
  poses: PoseData[];
  actions: ActionData[];
  sequences: SequenceData[];
}

/**
 * Handles serialization and deserialization of animation data.
 */
export class Serializer {
  static readonly VERSION = '1.0.0';

  /**
   * Exports a pose library to JSON string.
   */
  static exportPoses(library: PoseLibrary): string {
    return JSON.stringify(library.toJSON(), null, 2);
  }

  /**
   * Imports poses from JSON string into a library.
   */
  static importPoses(json: string, library: PoseLibrary): void {
    const data = JSON.parse(json) as PoseData[];
    library.loadFromJSON(data);
  }

  /**
   * Exports an action library to JSON string.
   */
  static exportActions(library: ActionLibrary): string {
    return JSON.stringify(library.toJSON(), null, 2);
  }

  /**
   * Imports actions from JSON string into a library.
   */
  static importActions(json: string, library: ActionLibrary): void {
    const data = JSON.parse(json) as ActionData[];
    library.loadFromJSON(data);
  }

  /**
   * Exports a sequence to JSON string.
   */
  static exportSequence(sequence: Sequence): string {
    return JSON.stringify(sequence.toJSON(), null, 2);
  }

  /**
   * Imports a sequence from JSON string.
   */
  static importSequence(json: string, figures: Map<string, Figure>): Sequence {
    const data = JSON.parse(json) as SequenceData;
    return Sequence.fromJSON(data, figures);
  }

  /**
   * Exports a full project (poses, actions, sequences).
   */
  static exportProject(
    poseLibrary: PoseLibrary,
    actionLibrary: ActionLibrary,
    sequences: Sequence[]
  ): string {
    const project: ProjectData = {
      version: Serializer.VERSION,
      poses: poseLibrary.toJSON(),
      actions: actionLibrary.toJSON(),
      sequences: sequences.map((s) => s.toJSON()),
    };
    return JSON.stringify(project, null, 2);
  }

  /**
   * Imports a full project.
   */
  static importProject(
    json: string,
    poseLibrary: PoseLibrary,
    actionLibrary: ActionLibrary,
    figures: Map<string, Figure>
  ): Sequence[] {
    const project = JSON.parse(json) as ProjectData;

    // Import poses
    poseLibrary.loadFromJSON(project.poses);

    // Import actions
    actionLibrary.loadFromJSON(project.actions);

    // Import sequences
    return project.sequences.map((data) => Sequence.fromJSON(data, figures));
  }

  /**
   * Downloads data as a JSON file.
   */
  static downloadJSON(data: string, filename: string): void {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Reads a JSON file and returns its contents.
   */
  static async readJSONFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}
