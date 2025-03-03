const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 25; // Cada "casa" da grade tem 25x25 pixels
const gameWidth = canvas.width
const gameHeight = canvas.height
const velocity = gridSize
let canMove = true; // Controla se o jogador pode se mover

let player = [    
    {x: gridSize*3, y: 0, width: gridSize, height: gridSize},
    {x: gridSize*2, y: 0, width: gridSize, height: gridSize},
    {x: gridSize*1, y: 0, width: gridSize, height: gridSize},
    {x: gridSize*0, y: 0, width: gridSize, height: gridSize}
    ];

let keys = {}; // Objeto para armazenar teclas pressionadas
let gameState = "menu"; // Estados: "menu" ou "playing"
let score = 0; // Apenas um número de teste
let maca;
createFood()

// gerando posição da maça
function createFood() {
    let newX, newY;
    do {
        newX = Math.round(Math.random() * ((canvas.width - gridSize) / gridSize)) * gridSize;
        newY = Math.round(Math.random() * ((canvas.height - gridSize) / gridSize)) * gridSize;
    } while (
        newX === player.x && newY === player.y // Evita que apareça no player
    );
    maca = { x: newX, y: newY , width: 25, height: 25};
}

// detectando teclado
window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

// tirar e mudar o update para fazer movimento da cobra
window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
    canMove = true;
});

function playerMovement(direction) {
    if (direction == 'right') {
        
        for (let i = 1; i < player.length; i++) {
            let posicaoAnterior = player[i-1];
            player[i].x = posicaoAnterior.x
            player[i].y = posicaoAnterior.y

            posicaoAnterior = player[i]
        }
    }
}

function update() {
    if (canMove) {
        if (keys["ArrowUp"]) {
            player.y -= velocity;
            canMove = false;
        }
        if (keys["ArrowDown"]) {
            player.y += velocity;
            canMove = false;
        }
        if (keys["ArrowLeft"]) {
            player.x -= velocity;
            canMove = false;
        }
        if (keys["ArrowRight"]) {
            playerMovement('right')
            for (let i = 0; i < player.length; i++) {
                player[i].x += velocity;
            }
            canMove = false;
        }
    }

    // checando colisão com maça
    if (checkCollision(player, maca)) {
        score += 1;
        createFood();
    }

    // limitando area de movimento do player
    if (player.x > canvas.width - gridSize) {
        player.x = 0
    }
    if (player.x < 0) {
        player.x = canvas.width - gridSize
    }
    if (player.y > canvas.height - gridSize) {
        player.y = 0
    }
    if (player.y < 0) {
        player.y = canvas.height - gridSize
    }
}

// click do mouser
canvas.addEventListener("click", (event) => {
    let rect = canvas.getBoundingClientRect();
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;

    if (gameState === "menu") {
        // Se clicar no botão "Começar"
        if (mouseX > canvas.width / 2 - 75 && mouseX < canvas.width / 2 + 75 &&
            mouseY > 250 && mouseY < 300) {
            gameState = "playing";
        }
    }
});

// função pra desenhar o menu
function drawMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Meu Jogo", canvas.width / 2, 150);

    ctx.font = "20px Arial";
    ctx.fillText("Último Score: " + score, canvas.width / 2, 200);

    // Botão "Começar"
    ctx.fillStyle = "green";
    ctx.fillRect(canvas.width / 2 - 75, 250, 150, 50);
    ctx.fillStyle = "white";
    ctx.fillText("Começar", canvas.width / 2, 280);
}

// função pra desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

    // maça
    ctx.fillStyle = "red";
    ctx.fillRect(maca.x, maca.y, maca.width, maca.height);

    // jogador
    ctx.fillStyle = "green"; // cor do objeto
    for (let i = 0;  i < player.length; i++) {
        ctx.fillRect(player[i].x, player[i].y, player[i].width, player[i].height); // desenha quadrado
    };
}

// Função para rodar o jogo continuamente
function gameLoop() {
    if (gameState === "menu") {
        drawMenu();
    } else if (gameState === "playing") {
        update(); // Atualiza a posição do jogador
        draw();
    }
    requestAnimationFrame(gameLoop); // Chama a função novamente no próximo frame
}

// função de colisão
function checkCollision(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}


gameLoop(); // Inicia o loop do jogo