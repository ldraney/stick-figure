import { Skeleton } from '../core/Skeleton';
import { SVGRenderer, SVGRendererOptions } from '../svg/SVGRenderer';
import { PoseLibrary, defaultPoseLibrary } from '../animation/PoseLibrary';
import { Action } from './Action';
import { ActionLibrary, defaultActionLibrary } from './ActionLibrary';

// GSAP Timeline type
type GSAPTimeline = ReturnType<typeof import('gsap').gsap.timeline>;

/**
 * A Figure combines a Skeleton with action performance capabilities.
 * This is the main interface for the choreography layer.
 */
export interface FigureOptions {
  name?: string;
  x?: number; // Position offset in the scene
  y?: number;
  facing?: 'left' | 'right'; // Direction the figure faces
  color?: string; // Override bone color
}

export class Figure {
  readonly name: string;
  readonly skeleton: Skeleton;

  private renderer: SVGRenderer | null = null;
  private poseLibrary: PoseLibrary;
  private actionLibrary: ActionLibrary;

  private currentTimeline: GSAPTimeline | null = null;
  private currentAction: Action | null = null;

  // Position in scene
  x: number;
  y: number;
  facing: 'left' | 'right';
  color: string;

  constructor(options: FigureOptions = {}) {
    this.name = options.name ?? 'figure';
    this.x = options.x ?? 0;
    this.y = options.y ?? 0;
    this.facing = options.facing ?? 'right';
    this.color = options.color ?? '#00d9ff';

    this.skeleton = Skeleton.createHumanoid();
    this.poseLibrary = defaultPoseLibrary;
    this.actionLibrary = defaultActionLibrary;
  }

  /**
   * Attaches this figure to a DOM container for rendering.
   */
  attachTo(container: HTMLElement, rendererOptions: SVGRendererOptions = {}): void {
    const opts: SVGRendererOptions = {
      ...rendererOptions,
      boneColor: this.color,
    };

    this.renderer = new SVGRenderer(container, this.skeleton, opts);

    // Apply facing direction
    if (this.facing === 'left') {
      this.renderer.getSVGElement().style.transform = 'scaleX(-1)';
    }
  }

  /**
   * Performs a named action, returning the GSAP timeline for control.
   */
  perform(actionName: string): GSAPTimeline | null {
    const action = this.actionLibrary.get(actionName);
    if (!action) {
      console.warn(`Action "${actionName}" not found`);
      return null;
    }

    // Stop any current action
    this.stop();

    this.currentAction = action;
    this.currentTimeline = action.createTimeline(
      this.skeleton,
      this.poseLibrary,
      () => this.renderer?.update()
    );

    return this.currentTimeline;
  }

  /**
   * Performs an action and plays it immediately.
   * Returns a promise that resolves when the action completes.
   */
  async performAndPlay(actionName: string): Promise<void> {
    const timeline = this.perform(actionName);
    if (!timeline) return;

    return new Promise((resolve) => {
      timeline.eventCallback('onComplete', () => resolve());
      timeline.play();
    });
  }

  /**
   * Plays the current action timeline.
   */
  play(): void {
    this.currentTimeline?.play();
  }

  /**
   * Pauses the current action.
   */
  pause(): void {
    this.currentTimeline?.pause();
  }

  /**
   * Stops the current action and resets to bind pose.
   */
  stop(): void {
    if (this.currentTimeline) {
      this.currentTimeline.kill();
      this.currentTimeline = null;
    }
    this.currentAction = null;
    this.skeleton.resetToBind();
    this.renderer?.update();
  }

  /**
   * Seeks to a specific time in the current action.
   */
  seek(time: number): void {
    this.currentTimeline?.seek(time);
  }

  /**
   * Seeks to a normalized progress (0-1) in the current action.
   */
  seekProgress(progress: number): void {
    if (this.currentTimeline) {
      this.currentTimeline.progress(progress);
    }
  }

  /**
   * Sets a pose directly (no animation).
   */
  setPose(poseName: string): void {
    const pose = this.poseLibrary.get(poseName);
    if (pose) {
      pose.applyTo(this.skeleton);
      this.renderer?.update();
    }
  }

  /**
   * Gets the current action name.
   */
  getCurrentActionName(): string | null {
    return this.currentAction?.name ?? null;
  }

  /**
   * Gets the current timeline progress (0-1).
   */
  getProgress(): number {
    return this.currentTimeline?.progress() ?? 0;
  }

  /**
   * Checks if currently playing.
   */
  isPlaying(): boolean {
    return this.currentTimeline?.isActive() ?? false;
  }

  /**
   * Updates the renderer (call after external skeleton modifications).
   */
  update(): void {
    this.renderer?.update();
  }

  /**
   * Sets custom pose library.
   */
  setPoseLibrary(library: PoseLibrary): void {
    this.poseLibrary = library;
  }

  /**
   * Sets custom action library.
   */
  setActionLibrary(library: ActionLibrary): void {
    this.actionLibrary = library;
  }

  /**
   * Gets all available action names.
   */
  getAvailableActions(): string[] {
    return this.actionLibrary.getNames();
  }

  /**
   * Gets the SVG renderer.
   */
  getRenderer(): SVGRenderer | null {
    return this.renderer;
  }

  /**
   * Cleans up the figure.
   */
  dispose(): void {
    this.stop();
    this.renderer?.dispose();
    this.renderer = null;
  }
}
