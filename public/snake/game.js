const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const startBtn = document.getElementById('start-btn');

const tileCount = 21;
const tileSize = canvas.width / tileCount;
const tickMs = 95;

let snake = [];
let food = { x: 10, y: 10 };
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let score = 0;
let best = Number(localStorage.getItem('snake-best') || 0);
let running = false;
let gameLoopId = null;

bestEl.textContent = best;

function reset() {
  const center = Math.floor(tileCount / 2);
  snake = [
    { x: center - 1, y: center },
    { x: center, y: center },
    { x: center + 1, y: center },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = score;
  spawnFood();
  draw();
}

function spawnFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((cell) => cell.x === food.x && cell.y === food.y));
}

function setOverlay(title, text, buttonLabel = 'Start Game') {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  startBtn.textContent = buttonLabel;
  overlay.hidden = false;
}

function hideOverlay() {
  overlay.hidden = true;
}

function startGame() {
  reset();
  running = true;
  hideOverlay();
  clearInterval(gameLoopId);
  gameLoopId = setInterval(tick, tickMs);
}

function endGame() {
  running = false;
  clearInterval(gameLoopId);

  if (score > best) {
    best = score;
    localStorage.setItem('snake-best', String(best));
    bestEl.textContent = best;
  }

  setOverlay('Game Over', `You scored ${score}. Try to beat ${best}!`, 'Play Again');
}

function tick() {
  direction = nextDirection;
  const head = snake[snake.length - 1];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };

  const outOfBounds =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= tileCount ||
    nextHead.y >= tileCount;

  const willEat = nextHead.x === food.x && nextHead.y === food.y;
  const bodyToCheck = willEat ? snake : snake.slice(1);
  const hitsSelf = bodyToCheck.some((cell) => cell.x === nextHead.x && cell.y === nextHead.y);

  if (outOfBounds || hitsSelf) {
    endGame();
    return;
  }

  snake.push(nextHead);

  if (willEat) {
    score += 1;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.shift();
  }

  draw();
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(68, 84, 126, 0.35)';
  ctx.lineWidth = 1;

  for (let i = 0; i <= tileCount; i += 1) {
    const p = i * tileSize;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(canvas.width, p);
    ctx.stroke();
  }
}

function drawRoundedRect(x, y, size, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + size - radius, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
  ctx.lineTo(x + size, y + size - radius);
  ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
  ctx.lineTo(x + radius, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0c1733';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawGrid();

  const padding = 2;
  snake.forEach((cell, idx) => {
    const x = cell.x * tileSize + padding;
    const y = cell.y * tileSize + padding;
    const size = tileSize - padding * 2;
    const color = idx === snake.length - 1 ? '#7cff8a' : '#5dd6ff';
    drawRoundedRect(x, y, size, 5, color);
  });

  const fx = food.x * tileSize + 3;
  const fy = food.y * tileSize + 3;
  const fs = tileSize - 6;
  drawRoundedRect(fx, fy, fs, 6, '#ff7f98');
}

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const map = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
  };

  const intended = map[key];
  if (!intended || !running) return;
  event.preventDefault();

  const isReverse =
    intended.x === -direction.x &&
    intended.y === -direction.y;

  if (!isReverse) {
    nextDirection = intended;
  }
});

startBtn.addEventListener('click', startGame);

setOverlay('Snake Mini', 'Use arrow keys or WASD to move.', 'Start Game');
reset();
