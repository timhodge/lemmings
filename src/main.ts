import { Game } from './game';
import { levels } from './levels';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = new Game(canvas);

let currentLevel = 0;
const unlockedKey = 'lemmings-unlocked';

function getUnlocked(): number {
  const stored = localStorage.getItem(unlockedKey);
  return stored ? parseInt(stored, 10) : 0;
}

function setUnlocked(level: number): void {
  const current = getUnlocked();
  if (level > current) {
    localStorage.setItem(unlockedKey, String(level));
  }
}

function showLevelSelect(): void {
  const unlocked = getUnlocked();
  const container = document.getElementById('game-container')!;
  const toolbar = document.getElementById('toolbar')!;
  toolbar.innerHTML = '';

  // Hide the canvas, show level select
  canvas.style.display = 'none';
  document.getElementById('level-name')!.textContent = 'Select Level';
  document.getElementById('out-count')!.textContent = '-';
  document.getElementById('saved-count')!.textContent = '-';
  document.getElementById('needed-count')!.textContent = '-';

  let selectDiv = document.getElementById('level-select');
  if (!selectDiv) {
    selectDiv = document.createElement('div');
    selectDiv.id = 'level-select';
    container.appendChild(selectDiv);
  }
  selectDiv.style.display = 'grid';
  selectDiv.innerHTML = '';

  for (let i = 0; i < levels.length; i++) {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    const locked = i > unlocked;
    if (locked) btn.classList.add('locked');
    if (i <= unlocked && i > 0) btn.classList.add('completed');

    btn.innerHTML = `
      <span class="level-number">${i + 1}</span>
      <span class="level-title">${levels[i].name.replace(/^\d+\.\s*/, '')}</span>
      <span class="level-info">${locked ? 'LOCKED' : `Save ${levels[i].saveRequired}/${levels[i].lemmingCount}`}</span>
    `;

    if (!locked) {
      btn.addEventListener('click', () => startLevel(i));
    }

    selectDiv.appendChild(btn);
  }
}

function startLevel(index: number): void {
  currentLevel = index;

  const selectDiv = document.getElementById('level-select');
  if (selectDiv) selectDiv.style.display = 'none';
  canvas.style.display = 'block';

  game.loadLevel(levels[index]);
  game.onLevelComplete = (saved, required) => {
    const won = saved >= required;
    // Show retry/next buttons
    const toolbar = document.getElementById('toolbar')!;
    toolbar.innerHTML = '';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'ability-btn control-btn';
    retryBtn.innerHTML = '<span class="count">R</span>retry';
    retryBtn.addEventListener('click', () => startLevel(currentLevel));
    toolbar.appendChild(retryBtn);

    if (won) {
      setUnlocked(currentLevel + 1);

      if (currentLevel < levels.length - 1) {
        const nextBtn = document.createElement('button');
        nextBtn.className = 'ability-btn control-btn';
        nextBtn.innerHTML = '<span class="count">></span>next';
        nextBtn.addEventListener('click', () => startLevel(currentLevel + 1));
        toolbar.appendChild(nextBtn);
      }
    }

    const menuBtn = document.createElement('button');
    menuBtn.className = 'ability-btn control-btn';
    menuBtn.innerHTML = '<span class="count">M</span>menu';
    menuBtn.addEventListener('click', () => showLevelSelect());
    toolbar.appendChild(menuBtn);
  };
  game.start();
}

// Start with level select
showLevelSelect();
