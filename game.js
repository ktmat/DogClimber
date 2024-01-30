let gameData, player, gameLogo, CURRENTSCREEN, startGameButton, gameSplash,
brickImage, lives, prevScreen, livesImage, initialBrick, initialEnemy, leftWall, rightWall;
let canMove;
let platforms = [];
let bricks = [];
let isLevel1Init = false;
let isLevel2Init = false;
let brickUnbreak;
let enemies = [];
let enemyLocations = [];
let initialBricks = [];
let initialEnemies = [];
let playerSpriteImage, snakeImage;
let dogBone;
let canAttack;
let poop;
let poops = [];
let creditTimer = 0;
let level2Timer = 0;
let endLevel2Timer = 0;

function preload() {
    gameData = loadJSON("gameElements.json");
    gameLogo = loadImage("assets/sprites/logo1.png");
    brickImage = loadImage("assets/sprites/brick.png");
    brickUnbreak = loadImage("assets/sprites/brickUnbreak1.png");
    livesImage = loadImage("assets/sprites/life.png");
    playerSpriteImage = loadImage("assets/sprites/dogsprite1.png");
    dogBone = loadImage("assets/sprites/bone.png");
    snakeImage = loadImage("assets/sprites/snake1.png");
}

function setup() {
    isButtonInit = false;
    createCanvas(1000, 500);
    CURRENTSCREEN = "MAINMENU";
    startGameButton = createButton("Start Game");
    startGameButton.position(width / 2, height / 2 + 500);
    startGameButton.mouseClicked(changeCurrentScreenToLevelOne);
    gameSplash = image(gameLogo, 100, 100);
    world.gravity.y = 5;
}

function draw() {
    console.log(CURRENTSCREEN);
    if (CURRENTSCREEN == "MAINMENU") {
        loadMainMenu();
    } else if (CURRENTSCREEN == "LEVEL1") {
        loadLevelOne();
        enemyMovement();
        //console.log(lives);
        handleInput();
        camera.y = player.y;
        collisionCheck();
        checkLives();
    } else if (CURRENTSCREEN == "LEVEL2") {
        loadLevelTwo();
        enemyMovement();
        handleInput();
        camera.y = player.y;
        collisionCheck();
        checkLives();
    } else if (CURRENTSCREEN == "SCOREBOARD") {
        scoreboardScreen();
    } else if (CURRENTSCREEN == "CREDITS") {
        credits();
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
    if (player.collide(dogBoneSprite) && CURRENTSCREEN == "LEVEL1") {
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].remove();
        }
        for (let i = 0; i < bricks.length; i++) {
            bricks[i].remove();
            player.remove();
            dogBoneSprite.remove();
            leftWall.remove();
            rightWall.remove();
            prevScreen = "LEVEL1";
            CURRENTSCREEN = "SCOREBOARD";
        }
    }
    if (player.collide(dogBoneSprite) && CURRENTSCREEN == "LEVEL2") {
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].remove();
        }
        for (let i = 0; i < bricks.length; i++) {
            bricks[i].remove();
            player.remove();
            dogBoneSprite.remove();
            leftWall.remove();
            rightWall.remove();
            prevScreen = "LEVEL2";
            CURRENTSCREEN = "SCOREBOARD";
        }
    }
    for (let i = 0; i < enemies.length; i++) {
        for (let j = 0; j < poops.length; j++) {
            if (enemies[i].collide(poops[j])) {
                enemies[i].remove();
                poops[j].remove();
            }
        }
    }
}

function loadLevelOne() {
    background('grey');
    CURRENTSCREEN = "LEVEL1";
    prevScreen = "LEVEL1";
    startGameButton.hide();
    if (!isLevel1Init) {
        lives = 3;
        player = new Sprite(500, 750, 32, 25);  
        player.spriteSheet = playerSpriteImage;
        player.anis.offset.x = 1;
        player.debug = true;
        player.addAnis({
            idle: {row: 1, frames: 1},
            run: {row: 1, frames: 6},
            jump: {row: 2, frames: 5}
        });
        player.rotationLock = true;
        player.changeAni('idle');
        // player.diameter = 35;
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

            enemy = new Sprite(enemyData.x, enemyData.y, 80, 40, 'dynamic');
            enemy.spriteSheet = snakeImage;
            //enemy.scale = 1;
            enemy.anis.offset.x = 1;
            enemy.debug = true;
            enemy.scale = 1;
            enemy.addAnis({
                walk: {row: 3, frames: 4}
            });
            enemy.changeAni('walk');
            enemy.rotationLock = true;
            //enemy.vel.x = 1;
            enemy.moveValue = 1;
            initialEnemy = enemy;
            enemies.push(enemy);
            initialEnemies.push(initialEnemy);
        }
        leftWall = new Sprite(5, height / 2, 10, height + 620, 'static');
        leftWall.color = "grey";
        rightWall = new Sprite(width, height / 2, 20, height + 620, 'static');
        rightWall.color = "grey";
        dogBoneSprite = new Sprite(500, -20, 'static');
        dogBoneSprite.addImage(dogBone);
        dogBoneSprite.scale = 1;
        isLevel1Init = true;
    }
}

function loadLevelTwo() {
    background('grey');
    CURRENTSCREEN = "LEVEL2";
    prevScreen = "LEVEL2";
   // startGameButton.hide();
    if (!isLevel2Init) {
        lives = 3;
        player = new Sprite(500, 750, 32, 25);  
        player.spriteSheet = playerSpriteImage;
        player.anis.offset.x = 1;
        player.debug = true;
        player.addAnis({
            idle: {row: 1, frames: 1},
            run: {row: 1, frames: 6},
            jump: {row: 2, frames: 5}
        });
        player.rotationLock = true;
        player.changeAni('idle');
        // player.diameter = 35;
        player.isJumping = false;
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
        for (let i = 0; i < gameData.level2Enemies.length; i++) {
            let enemyData = gameData.level2Enemies[i];

            enemy = new Sprite(enemyData.x, enemyData.y, 80, 40, 'dynamic');
            enemy.spriteSheet = snakeImage;
            //enemy.scale = 1;
            enemy.anis.offset.x = 1;
            enemy.debug = true;
            enemy.scale = 1;
            enemy.addAnis({
                walk: {row: 3, frames: 4}
            });
            enemy.changeAni('walk');
            enemy.rotationLock = true;
            //enemy.vel.x = 1;
            enemy.moveValue = 1;
            initialEnemy = enemy;
            enemies.push(enemy);
            initialEnemies.push(initialEnemy);
        }
        leftWall = new Sprite(5, height / 2, 10, height + 620, 'static');
        leftWall.color = "grey";
        rightWall = new Sprite(width, height / 2, 20, height + 620, 'static');
        rightWall.color = "grey";
        dogBoneSprite = new Sprite(500, -20, 'static');
        dogBoneSprite.addImage(dogBone);
        dogBoneSprite.scale = 1;
        isLevel2Init = true;
    }
}

function loadMainMenu() {
    isLevel1Init = false;
    isLevel2Init = false;
    level2Timer = 0;
    endLevel2Timer = 0;
    creditTimer = 0;
    startGameButton.show();
    startGameButton.mouseClicked(loadLevelOne);
    gameSplash = image(gameLogo, 100, 100);
}

function handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
		player.position.x += -2.5
        player.changeAni('run');
        player.mirror.x = true;
	} else if (kb.pressed(' ') && canAttack) {
        makePoop();
    } else if (keyIsDown(RIGHT_ARROW)) {
		player.position.x += 2.5;
        player.changeAni('run');
        player.mirror.x = false;
	} else if (kb.pressed(UP_ARROW) && !player.isJumping) {
        player.vel.y = -5;
        player.isJumping = true;
        player.changeAni('jump');
    } else {
		player.vel.x = 0;
        player.changeAni('idle');
	}
}

function createBrick(x, y, width, height, isUnbreakable) {
    let brick = new Sprite(x, y, width, height, 'static');
    brick.isUnbreakable = isUnbreakable;
    brick.initialX = x;
    brick.initialY = y;
    brick.initialWidth = width;
    brick.initialHeight = height;
    return brick;
}

function scoreboardScreen() {
    if (prevScreen == "LEVEL1") {
        level2Timer += 0.25;
        background('black');
        fill(color('white'));
        text("You beat Level 1, Here is Level 2!", width / 2, height / 2);
        if (level2Timer >= 50) {
            CURRENTSCREEN = "LEVEL2";
        }
    }
    else {
        endLevel2Timer += 0.25;
        background('black');
        fill(color('white'));
        text("You beat Level 2!", width / 2, height / 2);
        if (endLevel2Timer >= 50) {
            CURRENTSCREEN = "CREDITS";
        }
        //console.log("SCOREBOARD AFTER LEVEL2");
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
    for (let j = 0; j < poops.length; j++) {
        poops[j].remove();
    }
    leftWall.remove();
    rightWall.remove();
    leftWall = new Sprite(0, height / 2, 10, height + 620, 'static');
    leftWall.color = "grey";
    rightWall = new Sprite(width, height / 2, 20, height + 620, 'static');
    rightWall.color = "grey";

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].remove();
        enemies[i] = new Sprite(initialEnemies[i].x, initialEnemies[i].y, 80, 40, 'dynamic');
        enemies[i].spriteSheet = snakeImage;
        enemies[i].anis.offset.x = 1;
        enemies[i].debug = true;
        enemies[i].addAnis({
            walk: {row: 3, frames: 4}
        });
        enemies[i].changeAni('walk');
        enemies[i].rotationLock = true;
        enemies[i].moveValue = 1;
    }
    lives = lives - 1;
    player.position.x = 500;
    player.position.y = 750;
}

function enemyMovement() {
    for (let i = 0; i < enemies.length; i++) {
        let canMove = true;
        if (enemies[i].collide(rightWall)) {
            enemies[i].mirror.x = true;
            enemies[i].moveValue = -1;
            canMove = false;
        } else if (enemies[i].collide(leftWall)) {
            enemies[i].mirror.x = false;
            enemies[i].moveValue = 1;
            canMove = false;
        }

        // only update position if canMove is true
        if (canMove) {
            //enemies[i].changeAni('walk');
            enemies[i].position.x += enemies[i].moveValue;
        }
    }
}

function makePoop() {
    poop = new Sprite(player.position.x, player.position.y);
    poop.diameter = 15;
    poop.color = color(123, 63, 0);
    poops.push(poop);
    canAttack = false;
}

function credits() {
    creditTimer += 0.25;
    background('black');
    fill(color('white'));
    text("Game made by Kai Matolat", width / 2, height / 2);
    if (creditTimer >= 50) {
        CURRENTSCREEN = "MAINMENU";
    }
}

function checkLives() {
    if (lives == 0) {
        for (let i = 0; i < bricks.length; i++) {
            bricks[i].remove();
        }
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].remove();
        }
        leftWall.remove();
        rightWall.remove();
        player.remove();
        initialEnemies = [];
        enemies = [];
        poops = [];
        background('black');
        CURRENTSCREEN = "MAINMENU";
    }
}

function changeCurrentScreenToLevelOne() {
    CURRENTSCREEN = "LEVEL1";
}

function changeCurrentScreenToLevelTwo() {
    CURRENTSCREEN = "LEVEL2";
}