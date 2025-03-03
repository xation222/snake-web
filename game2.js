const gameBoard = document.querySelector("#gameBoard");
const menu = document.querySelector("#menu");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#181818";
const snakeColor = "green";
const foodColor = "red";
const unitSize = 25;
let nivel = ""
let running = false ;
let xVelocity = unitSize ;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0 ;
let snake = [
    {x:unitSize*4, y:0},
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

function gameStart(dificuldade){
    nivel = dificuldade;
    menu.style.display = "none";
    gameBoard.style.display = "block";
    running = true;
    scoreText.textContent = score;
    createFood()
    drawFood()
    nextTick()
};
function nextTick(){
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake()
            drawSnake()
            checkGameOver()
            nextTick()
        }, 75); // velocidade do game
    } else {
        displayGameOver()
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0,0,gameWidth, gameHeight)
};
function createFood(){
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
        return randNum
    }
    foodX = randomFood(0, gameWidth - unitSize)
    foodY = randomFood(0, gameHeight - unitSize)
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize)
};
function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity}
    snake.unshift(head);

    // se der a volta
    if (nivel == "Fácil") {
        if (snake[0].x > gameWidth - unitSize) {
            snake[0].x = 0;
        }
        if (snake[0].x < 0) {
            snake[0].x = gameWidth - unitSize;
        }
        if (snake[0].y > gameHeight - unitSize) {
            snake[0].y = 0;
        }
        if (snake[0].y < 0) {
            snake[0].y = gameHeight - unitSize;
        }
    }

    // se comer a maçã
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1;
        scoreText.textContent = score;
        createFood();
    } else {
        snake.pop();
    }
};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};
function changeDirection(event){
    const ketPressed = event.keyCode;
    console.log(ketPressed)
    const LEFT = 37;
    const LEFTa = 65;
    const UP = 38;
    const UPw = 87;
    const RIGHT = 39;
    const RIGHTd = 68;
    const DOWN = 40;
    const DOWNs = 83;
    
    const goingUP = (yVelocity == -unitSize);
    const goingDOWN = (yVelocity == unitSize);
    const goingRIGHT = (xVelocity == unitSize);
    const goingLEFT = (xVelocity == -unitSize);

    switch(true) {
        case((ketPressed == LEFT || ketPressed == LEFTa) && !goingRIGHT):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case((ketPressed == RIGHT || ketPressed == RIGHTd) && !goingLEFT):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case((ketPressed == UP || ketPressed == UPw) && !goingDOWN):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case((ketPressed == DOWN || ketPressed == DOWNs) && !goingUP):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};
function checkGameOver(){
    switch(true) {
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y)
            running = false;
    }
};
function displayGameOver(){
    clearBoard()
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "#b5c6c9";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth/2, gameHeight/2);
    running = false;
    resetBtn.style.display = "block"
};
function resetGame(){
    clearBoard()
    resetBtn.style.display = "none"
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize*4, y:0},
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]
    menu.style.display = "block";
    gameBoard.style.display = "none";
};
