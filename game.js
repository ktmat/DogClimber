let gameData;
let platforms = [];
let bricks = [];
let player;
let gameLogo;
let CURRENTSCREEN;
let startGameButton;
let isLevel1Init = false;
let isLevel2Init = false;
let gameSplash;
let brickImage;
let birdEnemy;
let snakeEnemy;

function preload() {
    gameData = loadJSON("gameElements.json", initialiseGame);
    gameLogo = loadImage("assets/sprites/logo.png");
    brickImage = loadImage("assets/sprites/brick.png");
    
}

function setup() {
    createCanvas(1000, 500);
    CURRENTSCREEN = "MAINMENU";
    startGameButton = createButton("Start Game");
    startGameButton.position(width / 2, height / 2 + 500);
    startGameButton.mouseClicked(loadLevelOne);
    gameSplash = image(gameLogo, 100, 100);
    world.gravity.y = 5;
}

function draw() {
    if (CURRENTSCREEN == "MAINMENU") {
        loadMainMenu();
    } else if (CURRENTSCREEN == "LEVEL1") {
        loadLevelOne();
        handleInput();
        camera.x = player.x;
        camera.y = player.y;
    } else if (CURRENTSCREEN == "LEVEL2") {
        levelTwo();
    } else if (CURRENTSCREEN == "SCOREBOARD") {
        scoreboardScreen();
    }
}

function initialiseGame() {

}

function collisionCheck() {

}

function loadLevelOne() {
    background('black');
    CURRENTSCREEN = "LEVEL1";
    startGameButton.hide();
    if (!isLevel1Init) {
        player = new Sprite(500, 750);  
        player.diameter = 35;
        bricks = [];
        for (let i = 0; i < gameData.platformsLevel1.length; i++) {
            platformData = gameData.platformsLevel1[i];

            let numberOfBricks = 50;
            let brickWidth = 1000 / numberOfBricks;
            let brickHeight = 20;

            for (let j = 0; j < numberOfBricks; j++) {
                let brickX = (platformData.x / 2) + (j * brickWidth);
                let brickY = platformData.y;
                let brick = new Sprite(brickX, brickY, brickWidth, brickHeight, 'static');
                brick.addImage(brickImage);
                bricks.push(brick);
            }
        }

        isLevel1Init = true;
    }
}

function loadLevelTwo() {
    background('black');
    CURRENTSCREEN = "LEVEL2";
    startGameButton.hide();
    if (!isLevel2Init) {
        player = new Sprite(500, 750);  
        player.diameter = 35;
        bricks = [];
        for (let i = 0; i < gameData.platformsLevel2.length; i++) {
            platformData = gameData.platformsLevel2[i];

            let numberOfBricks = 50;
            let brickWidth = 1000 / numberOfBricks;
            let brickHeight = 20;

            for (let j = 0; j < numberOfBricks; j++) {
                let brickX = (platformData.x / 2) + (j * brickWidth);
                let brickY = platformData.y;
                let brick = new Sprite(brickX, brickY, brickWidth, brickHeight, 'static');
                brick.addImage(brickImage);
                bricks.push(brick);
            }
        }

        isLevel2Init = true;
    }
}

function loadMainMenu() {

}

function handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
		player.vel.x = -2.5
	} else if (keyIsDown(RIGHT_ARROW)) {
		player.vel.x = 2.5;
	} else if (keyIsDown(UP_ARROW)) {
        player.vel.y -= 1;
        for (let i = 0; i < bricks.length; i++) {
            if (player.collide(bricks[i])) {
                // If the player collides with a brick, remove it
                bricks[i].remove();
            }
        }
    } else {
		player.vel.x = 0;
	}
}
