const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const score_div = document.getElementById('score');

let dx = 10;
let dy = 0;
let foodX = randomTen(0, canvas.width - 10);
let foodY = randomTen(0, canvas.height - 10);
let score = 0;
let changingDir = false;

let snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150},];

function init() {
    dx = 10;
    dy = 0;   
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
    score = 0;
    changingDir = false;
    snake = [{x: 150, y: 150}, {x: 140, y: 150}, {x: 130, y: 150}, {x: 120, y: 150}, {x: 110, y: 150},];
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = 'lightgreen';
    ctx.strokeStyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function restart(event) {
    const R_KEY = 82;
    const keyPressed = event.keyCode;
    if (keyPressed === R_KEY && gameEnd()) {
        console.log('AWAS');
        init();
        main();
    }
}

function changeDir(event) {
    // KEYS
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;
    // DIRECTIONS
    const up = dy === -10;
    const down = dy === 10;
    const left = dx === -10;
    const right = dx === 10;

    if (changingDir) {
        return;
    }

    changingDir = true;

    if (keyPressed === LEFT_KEY && !right) {
        dx = -10;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !down) {
        dx = 0;
        dy = -10;
    }
    if (keyPressed === RIGHT_KEY && !left) {
        dx = 10;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !up) {
        dx = 0;
        dy = 10;
    }

}

function randomTen(min, max) {
    return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}

function createFood() {
    foodX = randomTen(0, canvas.width - 10);
    foodY = randomTen(0, canvas.height - 10);
    snake.forEach(function isFoodOnSnake(snakePart) {
        const foodOnSnake = snakePart.x === foodX && snakePart.y === foodY;
        if (foodOnSnake) {
            createFood();
        }
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'darkred';
    ctx.fillRect(foodX, foodY, 10, 10);
    ctx.strokeRect(foodX, foodY, 10, 10);
}

function moveSnake() {
    const hd = {x: snake[0].x + dx, y: snake[0].y + dy}
    snake.unshift(hd);
    const snakeGetFood = snake[0].x === foodX && snake[0].y === foodY;
    changingDir = false;
    if (snakeGetFood) {
        createFood();
        score += 1;
        score_div.innerHTML = 'score: ' + score;
    }
    else {
        snake.pop();
    }
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.strokeRect(0,0, canvas.width, canvas.height);
}

function gameEnd() {
    for (let i = 4; i < snake.length; i++) {
        const collision = snake[0].x === snake[i].x && snake[0].y === snake[i].y;
        if (collision) {
            return true;
        }
    }
    const leftWall = snake[0].x < 0;
    const rightWall = snake[0].x > canvas.width - 10;
    const topWall = snake[0].y < 0;
    const botWall = snake[0].y > canvas.height - 10;

    return leftWall || rightWall || topWall || botWall
}

function main() {
    if (gameEnd()) {
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('PERDISTE MALO QLO', canvas.width/2, canvas.height/2);
        ctx.fillText('presiona R para reiniciar', canvas.width/2, canvas.height/2 + 20);
        return;
    }
    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main();
    }, 100);
}

document.addEventListener('keydown', changeDir);
document.addEventListener('keydown', restart);

main();