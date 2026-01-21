import { Figure, Sequence, defaultActionLibrary } from './choreography';

// Application state
let figureA: Figure;
let figureB: Figure;
let currentSequence: Sequence | null = null;
let isSequenceMode = false;

function init() {
  const container = document.getElementById('canvas-container');
  if (!container) return;

  // Create container for two figures
  const leftSide = document.createElement('div');
  leftSide.id = 'figure-a-container';
  leftSide.style.position = 'absolute';
  leftSide.style.left = '0';
  leftSide.style.top = '0';
  leftSide.style.width = '50%';
  leftSide.style.height = '100%';

  const rightSide = document.createElement('div');
  rightSide.id = 'figure-b-container';
  rightSide.style.position = 'absolute';
  rightSide.style.right = '0';
  rightSide.style.top = '0';
  rightSide.style.width = '50%';
  rightSide.style.height = '100%';

  container.appendChild(leftSide);
  container.appendChild(rightSide);

  // Create figures
  figureA = new Figure({ name: 'fighter_a', facing: 'right', color: '#00d9ff' });
  figureB = new Figure({ name: 'fighter_b', facing: 'left', color: '#ff6b6b' });

  figureA.attachTo(leftSide, { width: 400, height: 500 });
  figureB.attachTo(rightSide, { width: 400, height: 500 });

  // Start in guard pose
  figureA.setPose('guard');
  figureB.setPose('guard');

  setupControls();
  setupActionPalette();
}

function setupControls() {
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  playBtn?.addEventListener('click', () => {
    if (isSequenceMode && currentSequence) {
      currentSequence.play();
    }
  });

  pauseBtn?.addEventListener('click', () => {
    if (isSequenceMode && currentSequence) {
      currentSequence.pause();
    } else {
      figureA.pause();
      figureB.pause();
    }
  });

  resetBtn?.addEventListener('click', () => {
    if (isSequenceMode && currentSequence) {
      currentSequence.stop();
    } else {
      figureA.stop();
      figureB.stop();
    }
    figureA.setPose('guard');
    figureB.setPose('guard');
  });
}

function setupActionPalette() {
  const palette = document.getElementById('action-palette');
  if (!palette) return;

  // Add mode toggle
  const modeToggle = document.createElement('button');
  modeToggle.textContent = 'Toggle Sequence Mode';
  modeToggle.className = 'action-btn';
  modeToggle.style.background = '#6b5b95';
  modeToggle.addEventListener('click', () => {
    isSequenceMode = !isSequenceMode;
    modeToggle.style.background = isSequenceMode ? '#4CAF50' : '#6b5b95';
    modeToggle.textContent = isSequenceMode ? 'Sequence Mode ON' : 'Toggle Sequence Mode';

    if (isSequenceMode) {
      // Create sample fight sequence
      currentSequence = Sequence.createSampleFight(figureA, figureB);
      console.log('Sample sequence created with', currentSequence.getBeats().length, 'beats');
    }
  });
  palette.appendChild(modeToggle);

  // Group actions by category
  const categories = defaultActionLibrary.getCategories();

  for (const category of categories) {
    // Category header
    const header = document.createElement('div');
    header.style.width = '100%';
    header.style.marginTop = '10px';
    header.style.color = '#888';
    header.style.fontSize = '11px';
    header.style.textTransform = 'uppercase';
    header.textContent = category;
    palette.appendChild(header);

    // Action buttons
    const actions = defaultActionLibrary.getByCategory(category);
    for (const action of actions) {
      const btn = document.createElement('button');
      btn.className = 'action-btn';
      btn.textContent = action.name;
      btn.title = `Duration: ${action.duration}s`;

      btn.addEventListener('click', () => {
        if (!isSequenceMode) {
          // Trigger action on Figure A
          figureA.perform(action.name)?.play();
        }
      });

      // Right-click for Figure B
      btn.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!isSequenceMode) {
          figureB.perform(action.name)?.play();
        }
      });

      palette.appendChild(btn);
    }
  }

  // Instructions
  const instructions = document.createElement('div');
  instructions.style.width = '100%';
  instructions.style.marginTop = '15px';
  instructions.style.fontSize = '12px';
  instructions.style.color = '#666';
  instructions.innerHTML = `
    <strong>Controls:</strong><br>
    Left-click: Blue figure performs action<br>
    Right-click: Red figure performs action<br>
    Sequence Mode: Play pre-choreographed fight
  `;
  palette.appendChild(instructions);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
