let direction;
const gridSize = 16;
const container = document.createElement("div");
const snakeImg = "./snake.png";
let applePosition;
let tiles;
let snake;
let interval;
const up = -gridSize;
const down = gridSize;
const right = 1;
const left = -1;

function init() {
  container.innerHTML = "";
  container.style.display = "grid";
  container.classList.add("container");
  // container.style.background = "#00ff2a";

  container.style.gridTemplateColumns = "2rem ".repeat(gridSize);
  container.style.gridTemplateRows = "2rem ".repeat(gridSize);
  direction = 1;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement("div");
    tile.style.background = "grey";
    tile.style.width = "30px";
    tile.style.aspectRatio = "1 / 1";
    container.append(tile);
  }

  tiles = container.children;
  const defaultPosition = (gridSize * gridSize) / 2 + 5;
  snake = [
    defaultPosition,
    defaultPosition - 1,
    defaultPosition - 2,
    defaultPosition - 3,
  ];

  document.body.append(container);
  generateApple();
  interval = setInterval(move, 100);
}

function move() {
  const head = snake[0] + direction;

  if (
    (head % gridSize === 0 && direction === 1) ||
    (head % gridSize === gridSize - 1 && direction === -1) ||
    (head >= gridSize * gridSize && direction === gridSize) ||
    (head < 0 && direction === -gridSize) ||
    snake.includes(head)
  ) {
    clearInterval(interval);
    init();
    return;
  }

  snake.unshift(head);

  if (head === applePosition) {
    generateApple();
  } else {
    snake.pop();
  }

  updateBoard();
}

const snakeSprite = {
  headUp: "60px 0px",
  headDown: "30px -30px",
  headLeft: "60px -30px",
  headRight: "30px 0px",
  tailUp: "60px 60px",
  tailDown: "30px 30px",
  tailLeft: "60px 30px",
  tailRight: "30px 60px",
  bodyHorizontal: "-30px 0px",
  bodyVertical: "-60px -30px",
  bodyDoRt: "0px 0px",
  bodyDoLt: "-60px 0px",
  bodyLtUp: "-60px -60px",
  bodyRtUp: "0px -30px",
};

function getSegmentDirection(current, next) {
  const diff = next - current;
  if (diff === 1) return right;
  if (diff === -1) return left;
  if (diff === gridSize) return down;
  if (diff === -gridSize) return up;
  // return ;
}

function getBodySprite(prev, current, next) {
  const prevDir = getSegmentDirection(prev, current);
  const nextDir = getSegmentDirection(current, next);

  if (prevDir === right && nextDir === right) return snakeSprite.bodyHorizontal;
  if (prevDir === left && nextDir === left) return snakeSprite.bodyHorizontal;
  if (prevDir === up && nextDir === up) return snakeSprite.bodyVertical;
  if (prevDir === down && nextDir === down) return snakeSprite.bodyVertical;

  if (
    (prevDir === right && nextDir === down) ||
    (prevDir === up && nextDir === left)
  )
    return snakeSprite.bodyDoLt;
  if (
    (prevDir === right && nextDir === up) ||
    (prevDir === down && nextDir === left)
  )
    return snakeSprite.bodyLtUp;
  if (
    (prevDir === left && nextDir === down) ||
    (prevDir === up && nextDir === right)
  )
    return snakeSprite.bodyDoRt;
  if (
    (prevDir === left && nextDir === up) ||
    (prevDir === down && nextDir === right)
  )
    return snakeSprite.bodyRtUp;

  return snakeSprite.bodyHorizontal;
}

function getTailSprite(beforeTail, tail) {
  const tailDir = getSegmentDirection(tail, beforeTail);

  switch (tailDir) {
    case up:
      return snakeSprite.tailUp;
    case down:
      return snakeSprite.tailDown;
    case left:
      return snakeSprite.tailLeft;
    case right:
      return snakeSprite.tailRight;
    default:
      return snakeSprite.tailRight;
  }
}

function getHeadSprite() {
  switch (direction) {
    case up:
      return snakeSprite.headUp;
    case down:
      return snakeSprite.headDown;
    case left:
      return snakeSprite.headLeft;
    case right:
      return snakeSprite.headRight;
  }
}

function updateBoard() {
  Array.from(tiles).forEach((tile) => {
    tile.style.background = "#00dd76";
    tile.style.backgroundImage = "none";
    tile.style.borderRadius = ".1rem";
  });

  snake.forEach((segment, index) => {
    const tile = tiles[segment];
    tile.style.background = "#00dd76";
    tile.style.backgroundImage = `url(${snakeImg})`;
    tile.style.backgroundSize = "150px";

    if (index === 0) {
      tile.style.backgroundPosition = getHeadSprite(segment);
    } else if (index === snake.length - 1) {
      tile.style.backgroundPosition = getTailSprite(snake[index - 1], segment);
    } else {
      tile.style.backgroundPosition = getBodySprite(
        snake[index - 1],
        segment,
        snake[index + 1]
      );
    }
  });
  displayApple();
}

document.addEventListener("keydown", (e) => {
  const oldDirection = direction;
  switch (e.key) {
    case "w":
      direction = up;
      break;
    case "s":
      direction = down;
      break;
    case "a":
      direction = left;
      break;
    case "d":
      direction = right;
      break;
  }
  if (snake[0] + direction === snake[1]) direction = oldDirection;
});

function generateApple() {
  applePosition = Math.floor(Math.random() * gridSize * gridSize);
  while (snake.includes(applePosition)) {
    applePosition = Math.floor(Math.random() * gridSize * gridSize);
  }
}

function displayApple() {
  const appleTile = tiles[applePosition];
  appleTile.style.backgroundImage = `url(${snakeImg})`;
  appleTile.style.backgroundSize = "150px";
  appleTile.style.backgroundPosition = "150px 30px";
}

init();
