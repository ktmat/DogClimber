let gameData, player, gameLogo, CURRENTSCREEN, startGameButton, gameSplash,
brickImage, lives, prevScreen, livesImage, initialBrick, initialEnemy;
let platforms = [];
let bricks = [];
let isLevel1Init = false;
let isLevel2Init = false;
let brickUnbreak;
let enemies = [];
let enemyLocations = [];
let initialBricks = [];
let initialEnemies = [];

function preload() {
    gameData = loadJSON("gameElements.json");
    gameLogo = loadImage("assets/sprites/logo1.png");
    brickImage = loadImage("assets/sprites/brick.png");
    brickUnbreak = loadImage("assets/sprites/brickUnbreak1.png");
    livesImage = loadImage("assets/sprites/life.png");
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
        console.log(lives);
        handleInput();
        camera.y = player.y;
        collisionCheck();
        if (player.position.y <= -900) {
            for (let i = 0; i < enemies.length; i++) {
                enemies[i].remove();
            }
            for (let i = 0; i < bricks.length; i++) {
                bricks[i].remove();
                player.remove();
                prevScreen = "LEVEL1";
                CURRENTSCREEN = "SCOREBOARD";
            }
        }
        if (lives == 0) {
            for (let i = 0; i < bricks.length; i++) {
                bricks[i].remove();
            }
            for (let i = 0; i < enemies.length; i++) {
                enemies[i].remove();
            }
            player.remove();
            initialEnemies = [];
            enemies = [];
            CURRENTSCREEN = "MAINMENU";
        }
    } else if (CURRENTSCREEN == "LEVEL2") {
        loadLevelTwo();
        handleInput();
        camera.y = player.y;
        collisionCheck();
    } else if (CURRENTSCREEN == "SCOREBOARD") {
        scoreboardScreen();
    }
}

function collisionCheck() {
    // Check if player hits a brick from below.
    for (let i = 0; i < bricks.length; i++) {
        if (player.collide(bricks[i])) {
            if (bricks[i].isUnbreakable == 1) {
            } else {
                // If the player collides with a brick, remove it
                if (player.position.y >= bricks[i].position.y) {
                    bricks[i].remove();
                }
            }
        }
        if (player.collide(bricks[i]) && player.position.y <= bricks[i].position.y) {
            player.isJumping = false;
        }
    }
    for (let i = 0; i < enemies.length; i++) {
        if (player.collide(enemies[i])) {
            resetLevel();
        }
    }
}

function loadLevelOne() {
    background('black');
    CURRENTSCREEN = "LEVEL1";
    startGameButton.hide();
    if (!isLevel1Init) {
        lives = 3;
        player = new Sprite(500, 750);  
        player.diameter = 35;
        player.isJumping = false;
        bricks = [];
        for (let i = 0; i < gameData.platformsLevel1.length; i++) {
            platformData = gameData.platformsLevel1[i];

            let numberOfBricks = 50;
            let brickWidth = 1000 / numberOfBricks;
            let brickHeight = 20;

            for (let j = 0; j < numberOfBricks; j++) {
                let brickX = (platformData.x / 2) + (j * brickWidth);
                let brickY = platformData.y;
                let brick = createBrick(brickX, brickY, brickWidth, brickHeight, Math.floor(Math.random() * (2 - 1 + 1)) + 1);
                //initialBrick = brick;
                if (brick.isUnbreakable == 1) {
                    brick.addImage(brickUnbreak);
                } else {
                    brick.addImage(brickImage);
                }
               // brick.addImage(brickImage);
                bricks.push(brick);
                //initialBricks.push(initialBrick);
            }
        }
        for (let i = 0; i < gameData.level1Enemies.length; i++) {
            let enemyData = gameData.level1Enemies[i];

            enemy = new Sprite(enemyData.x, enemyData.y, 'dynamic');
            initialEnemy = enemy;
            enemies.push(enemy);
            initialEnemies.push(initialEnemy);
        }
        isLevel1Init = true;
    }
}

function loadLevelTwo() {
    background('black');
    CURRENTSCREEN = "LEVEL2";
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
                let brick = createBrick(brickX, brickY, brickWidth, brickHeight, Math.floor(Math.random() * (2 - 1 + 1)) + 1);
                if (brick.isUnbreakable == 1) {
                    brick.addImage(brickUnbreak);
                } else {
                    brick.addImage(brickImage);
                }
                bricks.push(brick);
            }
        }

        isLevel2Init = true;
    }
}

function loadMainMenu() {
    isLevel1Init = false;
    isLevel2Init = false;
    startGameButton.show();
    startGameButton.mouseClicked(loadLevelOne);
    gameSplash = image(gameLogo, 100, 100);
}

function handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
		player.vel.x = -2.5
	} else if (keyIsDown(RIGHT_ARROW)) {
		player.vel.x = 2.5;
	} else if (kb.pressed(UP_ARROW) && !player.isJumping) {
        player.vel.y = -5;
        player.isJumping = true;
    } else {
		player.vel.x = 0;
	}
}

function createBrick(x, y, width, height, isUnbreakable) {
    let brick = createSprite(x, y, width, height, 'static');
    brick.isUnbreakable = isUnbreakable;
    brick.initialX = x;
    brick.initialY = y;
    brick.initialWidth = width;
    brick.initialHeight = height;
    return brick;
}

function scoreboardScreen() {
    if (prevScreen == "LEVEL1") {

    } else if (prevScreen == "LEVEL2") {

    }
}

function resetLevel() {
    for (let i = 0; i < bricks.length; i++) {
        bricks[i].remove();
        bricks[i] = createBrick(bricks[i].initialX, bricks[i].initialY, bricks[i].initialWidth, bricks[i].initialHeight, bricks[i].isUnbreakable);
        if (bricks[i].isUnbreakable == 1) {
            bricks[i].addImage(brickUnbreak);
        } else {
            bricks[i].addImage(brickImage);
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].remove();
        enemies[i] = new Sprite(initialEnemies[i].x, initialEnemies[i].y); 
    }
    lives = lives - 1;
    player.position.x = 500;
    player.position.y = 750;
}