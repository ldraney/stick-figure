import { Skeleton } from '../core/Skeleton';
import { Bone } from '../core/Bone';

/**
 * Renders a Skeleton to SVG and keeps it in sync with skeleton state.
 */
export interface SVGRendererOptions {
  width?: number;
  height?: number;
  boneColor?: string;
  jointColor?: string;
  boneWidth?: number;
  jointRadius?: number;
  headRadius?: number;
  showJoints?: boolean;
}

const DEFAULT_OPTIONS: Required<SVGRendererOptions> = {
  width: 800,
  height: 500,
  boneColor: '#00d9ff',
  jointColor: '#ff6b6b',
  boneWidth: 4,
  jointRadius: 5,
  headRadius: 20,
  showJoints: false,
};

export class SVGRenderer {
  private svg: SVGSVGElement;
  private skeleton: Skeleton;
  private options: Required<SVGRendererOptions>;

  // SVG element groups
  private bonesGroup: SVGGElement;
  private jointsGroup: SVGGElement;
  private headGroup: SVGGElement;

  // Element references for updates
  private boneElements: Map<string, SVGLineElement> = new Map();
  private jointElements: Map<string, SVGCircleElement> = new Map();
  private headElement: SVGCircleElement | null = null;

  // Position offset for centering the figure
  private offsetX: number;
  private offsetY: number;

  constructor(
    container: HTMLElement,
    skeleton: Skeleton,
    options: SVGRendererOptions = {}
  ) {
    this.skeleton = skeleton;
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // Center the figure in the canvas
    this.offsetX = this.options.width / 2;
    this.offsetY = this.options.height / 2 + 20; // Slightly below center

    // Create SVG element
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', String(this.options.width));
    this.svg.setAttribute('height', String(this.options.height));
    this.svg.setAttribute('viewBox', `0 0 ${this.options.width} ${this.options.height}`);

    // Create groups (order matters for z-index)
    this.bonesGroup = this.createGroup('bones');
    this.jointsGroup = this.createGroup('joints');
    this.headGroup = this.createGroup('head');

    this.svg.appendChild(this.bonesGroup);
    this.svg.appendChild(this.headGroup);
    this.svg.appendChild(this.jointsGroup);

    container.appendChild(this.svg);

    // Initial render
    this.createElements();
    this.update();
  }

  private createGroup(id: string): SVGGElement {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', id);
    return group;
  }

  /**
   * Creates all SVG elements for bones and joints
   */
  private createElements(): void {
    // Create bone lines
    for (const bone of this.skeleton.bones.values()) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('stroke', this.options.boneColor);
      line.setAttribute('stroke-width', String(this.options.boneWidth));
      line.setAttribute('stroke-linecap', 'round');
      line.dataset.bone = bone.name;
      this.boneElements.set(bone.name, line);
      this.bonesGroup.appendChild(line);
    }

    // Create joint circles
    if (this.options.showJoints) {
      for (const joint of this.skeleton.joints.values()) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', String(this.options.jointRadius));
        circle.setAttribute('fill', this.options.jointColor);
        circle.dataset.joint = joint.name;
        this.jointElements.set(joint.name, circle);
        this.jointsGroup.appendChild(circle);
      }
    }

    // Create head circle
    this.headElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.headElement.setAttribute('r', String(this.options.headRadius));
    this.headElement.setAttribute('fill', 'none');
    this.headElement.setAttribute('stroke', this.options.boneColor);
    this.headElement.setAttribute('stroke-width', String(this.options.boneWidth));
    this.headGroup.appendChild(this.headElement);
  }

  /**
   * Updates all SVG elements to match current skeleton state
   */
  update(): void {
    this.skeleton.updateTransforms();

    // Update bone lines
    for (const bone of this.skeleton.bones.values()) {
      this.updateBone(bone);
    }

    // Update joint circles
    if (this.options.showJoints) {
      for (const joint of this.skeleton.joints.values()) {
        const element = this.jointElements.get(joint.name);
        if (element) {
          // Compute joint position from connected bones
          const pos = this.getJointPosition(joint.name);
          element.setAttribute('cx', String(pos.x + this.offsetX));
          element.setAttribute('cy', String(pos.y + this.offsetY));
        }
      }
    }

    // Update head position (at the end of neck bone)
    const neckBone = this.skeleton.getBone('neck');
    if (neckBone && this.headElement) {
      const endPoint = neckBone.getEndPoint();
      // Position head slightly above neck end
      const headX = endPoint.x + this.offsetX;
      const headY = endPoint.y + this.offsetY - this.options.headRadius * 0.5;
      this.headElement.setAttribute('cx', String(headX));
      this.headElement.setAttribute('cy', String(headY));
    }
  }

  /**
   * Updates a single bone's SVG element
   */
  private updateBone(bone: Bone): void {
    const element = this.boneElements.get(bone.name);
    if (!element) return;

    const endPoint = bone.getEndPoint();

    element.setAttribute('x1', String(bone.worldX + this.offsetX));
    element.setAttribute('y1', String(bone.worldY + this.offsetY));
    element.setAttribute('x2', String(endPoint.x + this.offsetX));
    element.setAttribute('y2', String(endPoint.y + this.offsetY));
  }

  /**
   * Gets a joint's current position based on connected bones
   */
  private getJointPosition(jointName: string): { x: number; y: number } {
    // Find a bone that starts or ends at this joint
    for (const bone of this.skeleton.bones.values()) {
      if (bone.jointStartName === jointName) {
        return { x: bone.worldX, y: bone.worldY };
      }
      if (bone.jointEndName === jointName) {
        const end = bone.getEndPoint();
        return { x: end.x, y: end.y };
      }
    }
    // Fallback to joint bind position
    const joint = this.skeleton.getJoint(jointName);
    return joint ? { x: joint.bindX, y: joint.bindY } : { x: 0, y: 0 };
  }

  /**
   * Sets the color for a specific bone (for highlighting)
   */
  setBoneColor(boneName: string, color: string): void {
    const element = this.boneElements.get(boneName);
    if (element) {
      element.setAttribute('stroke', color);
    }
  }

  /**
   * Resets all bone colors to default
   */
  resetColors(): void {
    for (const element of this.boneElements.values()) {
      element.setAttribute('stroke', this.options.boneColor);
    }
  }

  /**
   * Sets whether joints are visible
   */
  setShowJoints(show: boolean): void {
    this.options.showJoints = show;
    this.jointsGroup.style.display = show ? '' : 'none';
    if (show && this.jointElements.size === 0) {
      // Create joint elements if they don't exist
      for (const joint of this.skeleton.joints.values()) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', String(this.options.jointRadius));
        circle.setAttribute('fill', this.options.jointColor);
        circle.dataset.joint = joint.name;
        this.jointElements.set(joint.name, circle);
        this.jointsGroup.appendChild(circle);
      }
      this.update();
    }
  }

  /**
   * Returns the SVG element
   */
  getSVGElement(): SVGSVGElement {
    return this.svg;
  }

  /**
   * Returns the skeleton
   */
  getSkeleton(): Skeleton {
    return this.skeleton;
  }

  /**
   * Cleans up the renderer
   */
  dispose(): void {
    this.svg.remove();
    this.boneElements.clear();
    this.jointElements.clear();
  }
}
