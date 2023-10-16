const canvas = document.getElementById("canvas");
const canvasContext = canvas.getContext("2d");
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghosts");

let createRect = (x, y, width, height, color) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];
let gameIsOver = false;

// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let gameState = "playing";

function showGameOverScreen() {
    const gameOverElement = document.getElementById("game-over");
    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = "Final Score: " + score;
    gameOverElement.style.display = "block";
}

function startGame(){
    gameIsOver = false;
    drawFoods();
    drawWalls();
    createNewPacman();
    createGhosts();
    draw();
    gameState="playing"
    gameInterval = setInterval(gameLoop, 2000 / fps)
}

function restartGame() {

    resetLevel();
    var restartAudio = document.getElementById("restartAudio");
    restartAudio.play();
    gameIsOver = false;
    lives = 3;
    score = 0;
    drawFoods();
    drawWalls();
    createNewPacman();
    createGhosts();
    draw();
    hideGameOverScreen();
    

    const finalScoreElement = document.getElementById("final-score");
    finalScoreElement.textContent = "Final Score: 0";

    // Restart the game loop
    gameState="paused";
    setTimeout(()=>{
        gameState="playing"
        gameInterval = setInterval(gameLoop, 2000 / fps);
    },4500)
}

function hideGameOverScreen() {
    const gameOverElement = document.getElementById("game-over");
    gameOverElement.style.display = "none";
}

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 3, 3, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 3, 3, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];



let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

function areDotsRemaining() {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] === 2 || map[i][j] === 4) {
                return true; // There are remaining dots or power-ups
            }
        }
    }
    return false; // No dots or power-ups remaining
}


let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

function resetLevel() {
    // Reset the map and regenerate dots and power-ups
    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 4, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 4, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 3, 3, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 3, 3, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 4, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
        [1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 4, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

}

function gameLoop() {
    if (gameState === "playing") {
        if (areDotsRemaining() && lives >= 0) {
            update();
            draw();
        } else {
            // Reset the level while keeping lives and score
            resetLevel();
        }
    }
}


let gameInterval = setInterval(gameLoop, 2000 / fps);

let restartPacmanAndGhosts = () => {
    
    createNewPacman();
    createGhosts();
};

let onGhostCollision = () => {
    /*lives--;
    if (lives < 0) {
        deathAudio.play();
    }
    else{
        setInterval(restartPacmanAndGhosts(),9000)
    }*/
    //restartPacmanAndGhosts();
    if (gameState === "playing") {
        lives--;
        restartPacmanAndGhosts();
        //if (lives < 0) {
            deathAudio.play();
       // } else {
            gameState = "paused"; // Set the game state to "paused"
            setTimeout(() => {
                gameState = "playing"; // Resume the game after 2 seconds
            }, 2000); // 2 seconds
        //}
    }
};

function update(){
    if (gameIsOver) {
        return;
    }
    pacman.moveProcess();
    pacman.eat();
    pacman.powerUp(ghosts)
    updateGhosts();
    const collisionResult = pacman.checkGhostCollision(ghosts)
    if (collisionResult.collision) {
        if(ghosts[collisionResult.ghostIndex].weak){
            score+=100;
            killGhost(ghosts,collisionResult.ghostIndex)
            resetGhost(ghosts, collisionResult.ghostIndex)
        }
        else{
            onGhostCollision();
        }
    }
    if(!collisionResult.collision){
        sirenAudio.play();
    }

    if (lives < 0) {
        gameIsOver = true;
        showGameOverScreen();
        clearInterval(gameInterval); // Stop the game loop
    }
    
};


let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                const centerX = j * oneBlockSize + oneBlockSize / 2;
                const centerY = i * oneBlockSize + oneBlockSize / 2;
                const radius = oneBlockSize / 6;
                const startAngle = 0;
                const endAngle = Math.PI * 2;

                canvasContext.fillStyle = "#FEB897"; // Set the fill color
                canvasContext.beginPath();
                canvasContext.arc(centerX, centerY, radius, startAngle, endAngle);
                canvasContext.fill();
                canvasContext.closePath();
            }
            else if (map[i][j] == 4) {
                const centerX = j * oneBlockSize + oneBlockSize / 2;
                const centerY = i * oneBlockSize + oneBlockSize / 2;
                const radius = oneBlockSize / 3;
                const startAngle = 0;
                const endAngle = Math.PI * 2;

                canvasContext.fillStyle = "#FEB897"; // Set the fill color
                canvasContext.beginPath();
                canvasContext.arc(centerX, centerY, radius, startAngle, endAngle);
                canvasContext.fill();
                canvasContext.closePath();
            }
        }
    }
};


let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#342DCA"
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

function killGhost(ghosts , i){
    ghosts.splice(i,1);
    eatGhostAudio.play();
}

function resetGhost(ghosts , i){
    let newGhost = new Ghost(
        9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
        10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        pacman.speed / 2,
        ghostImageLocations[i % 4].x,
        ghostImageLocations[i % 4].y,
        124,
        116,
        6 + i
    );
    ghosts.splice(i,0,newGhost);
}

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < 4; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

document.getElementById("restart-button").addEventListener("click", restartGame);


startGame();
createNewPacman();
createGhosts();    
gameLoop();
     


window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});
