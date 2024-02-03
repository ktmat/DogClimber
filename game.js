let gameData, player, gameLogo, CURRENTSCREEN, startGameButton, gameSplash,
brickImage, lives, prevScreen, livesImage, initialBrick, initialEnemy, leftWall, rightWall, canMove;
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
let loadingTimer = 0;
let jumpSound, eatSound, steakImage;
let steaks = [];
let firstBricks = [];
let initialSteaks = [];
let initialSteak;
let deathSound;
let loadingVideo;
let isVideoInit;
let snakeDeathSound;
let replayData = [];
let userWantsReplay, isReplayInit, replayToView;
let JSONReplayData = [];
let replayLevel1IsInit;
let isReplaying;
let replayIndex = 0;
let count;
let isWallInit = false;
let isBricksInit = false;
let replayButton;
let uploadReplay;
let replayUploadButtonInit = false;
let dataToConvert;
let chickenImage;
let chicken;
let chickens = [];
let initialChickens = [];
let initialChicken;
let chickenScore = 0;
let lifeImage;
let lifeSprite;
let hasLevelReset;
let initReplayLevel = false;
let leftPlatform;
let rightPlatform;
let middlePlatform;
let platformMoveCount = 0;
let platformMoveCount2 = 0;
let wantReplayButton;

function preload() {
    gameData = loadJSON("gameElements.json");
    gameLogo = loadImage("assets/sprites/logo1.png");
    brickImage = loadImage("assets/sprites/brick.png");
    brickUnbreak = loadImage("assets/sprites/brickUnbreak1.png");
    livesImage = loadImage("assets/sprites/life.png");
    playerSpriteImage = loadImage("assets/sprites/dogsprite1.png");
    dogBone = loadImage("assets/sprites/bone.png");
    snakeImage = loadImage("assets/sprites/snake1.png");
    jumpSound = loadSound("assets/sounds/jump.wav");
    floorImage = loadImage("assets/sprites/floor2.png");
    steakImage = loadImage("assets/sprites/steak2.png");
    eatSound = loadSound("assets/sounds/eat.wav");
    deathSound = loadSound("assets/sounds/death.wav");
    snakeDeathSound = loadSound("assets/sounds/snakedeath.wav");
    chickenImage = loadImage("assets/sprites/chicken.png");
    lifeImage = loadImage("assets/sprites/life.png");
}

function setup() {
    isButtonInit = false;
    createCanvas(1000, 500);
    CURRENTSCREEN = "MAINMENU";
    startGameButton = createButton("Start Game");
    startGameButton.position(width / 2, height / 2 + 300);
    startGameButton.mouseClicked(changeCurrentScreenToLoading);
    replayButton = createButton("Watch Replay");
    replayButton.position(width / 2, height / 2 + 400);
    replayButton.mouseClicked(changeCurrentScreenToReplay);
    gameSplash = image(gameLogo, 100, 100);
    wantReplayButton = createButton("Want Replay for Level 1?");
    wantReplayButton.position(width / 2 + 200, height / 2 + 400);
    wantReplayButton.mouseClicked(enableReplayForLevel1);
    world.gravity.y = 5;
}

function uploadReplayScreen() {
    if (!replayUploadButtonInit) {
        wantReplayButton.hide();
        startGameButton.hide();
        allSprites.remove();
        background('black');
        uploadReplay = createFileInput(loadJSONReplayFile);
        uploadReplay.position(width / 2, height / 2);
        replayUploadButtonInit = true;
        replayButton.hide();
    }
}

function loadingScreen() {
    wantReplayButton.hide();
    replayButton.hide();
    background("black");
    loadingTimer += 0.25;
    startGameButton.hide();
    gameSplash = 0;
    if (!isVideoInit) {
        loadingVideo = createVideo("assets/video/loading.mp4");
        loadingVideo.loop();
        loadingVideo.position(0, 0);
        isVideoInit = true;
    }
    // fake the loading
    if (loadingTimer >= random(20, 50) && !prevScreen) {
        loadingVideo.remove();
        loadingTimer = 0;
        isVideoInit = false;
        CURRENTSCREEN = "LEVEL1";
    }

    if (loadingTimer >= random(20, 50) && prevScreen == "LEVEL1") {
        loadingVideo.remove();
        loadingTimer = 0;
        isVideoInit = false;
        CURRENTSCREEN = "LEVEL2";
    }

}

function draw() {
    //console.log(CURRENTSCREEN);
	//console.log(allSprites);
    if (CURRENTSCREEN == "MAINMENU") {
        loadMainMenu();
    } else if (CURRENTSCREEN == "LEVEL1") {
        loadLevelOne();
        if (userWantsReplay) {
            getGameState();
        }
        enemyMovement();
        //console.log(lives);
        handleInput();
        camera.y = player.y;
        collisionCheck();
        checkLives();
        movePlatforms();
    } else if (CURRENTSCREEN == "LEVEL2") {
        loadLevelTwo();
        if (userWantsReplay) {
            getGameState();
        }
        enemyMovement();
        handleInput();
        camera.y = player.y;
        collisionCheck();
        checkLives();
        movePlatforms();
    } else if (CURRENTSCREEN == "SCOREBOARD") {
        scoreboardScreen();
    } else if (CURRENTSCREEN == "CREDITS") {
        credits();
    } else if (CURRENTSCREEN == "LOADING") {
        loadingScreen();
    } else if (CURRENTSCREEN == "REPLAY") {
        replay();
    } else if (CURRENTSCREEN == "UPLOAD") {
        uploadReplayScreen();
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
    if (player.collide(rightPlatform) || player.collide(leftPlatform) || player.collide(middlePlatform)) {
        player.isJumping = false;
    }

    for (let i = 0; i < firstBricks.length; i++) {
        if (player.collide(firstBricks[i]) && player.position.y <= firstBricks[i].position.y) {
            player.isJumping = false;
        }
    }
    for (let i = 0; i < poops.length; i++) {
        if (player.collide(poops[i])) {
            // Make it so the player can't move the poop.
            //poops[i].collider = 's';
            player.isJumping = false;
        }
    }
    for (let i = 0; i < enemies.length; i++) {
        if (player.collide(enemies[i])) {
            deathSound.play();
            resetLevel();
        }
    }
    if (player.collide(dogBoneSprite) && CURRENTSCREEN == "LEVEL1") {
        eatSound.play();
        if (userWantsReplay) {
            saveReplayToJSON();
        }
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
        for (let i = 0; i < chickens.length; i++) {
            chickens[i].remove();
        }
        for (let i = 0; i < steaks.length; i++) {
            steaks[i].remove();
        }
        for (let i = 0; i < firstBricks.length; i++) {
            firstBricks[i].remove();
        }
        for (let i = 0; i < poops.length; i++) {
            poops[i].remove();
        }
    }
    if (player.collide(dogBoneSprite) && CURRENTSCREEN == "LEVEL2") {
        eatSound.play();
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
        for (let i = 0; i < chickens.length; i++) {
            chickens[i].remove();
        }
        for (let i = 0; i < steaks.length; i++) {
            steaks[i].remove();
        }
        for (let i = 0; i < firstBricks.length; i++) {
            firstBricks[i].remove();
        }
    }
    for (let i = 0; i < steaks.length; i++) {
        if (player.collide(steaks[i])) {
            eatSound.play();
            canAttack += 1;
            steaks[i].remove();
        }
    }
    for (let i = 0; i < chickens.length; i++) {
        if (player.collide(chickens[i])) {
            eatSound.play();
            chickenScore++;
            chickens[i].remove();
        }
    }

    // Check for collision of snakes with steaks. 
    for (let i = 0; i < enemies.length; i++) {
        for (let k = 0; k < steaks.length; k++) {
            if (enemies[i].collide(steaks[k])) {
                // Check whether the snake is coming from the left or right
                // Handle between the two cases.
                if (enemies[i].x > steaks[k].x) {
                    enemies[i].moveValue = 1;
                    enemies[i].mirror.x = false;
                } else {
                    enemies[i].moveValue = -1;
                    enemies[i].mirror.x = true;
                }
            }
        }
        for (let k = 0; k < chickens.length; k++) {
            if (enemies[i].collide(chickens[k])) {
                if (enemies[i].x > chickens[k].x) {
                    enemies[i].moveValue = 1;
                    enemies[i].mirror.x = false;
                } else {
                    enemies[i].moveValue = -1;
                    enemies[i].mirror.x = true;
                }
            }
        }

        // Check if snake collides with a poop, remove both poop and snake
        // from their respective arrays.
        for (let j = 0; j < poops.length; j++) {
            if (enemies[i].collide(poops[j])) {
                snakeDeathSound.play();
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
        makePlayer();
        bricks = [];
        for (let i = 0; i < gameData.platformsLevel1.length; i++) {
            platformData = gameData.platformsLevel1[i];

            let numberOfBricks = 50;
            let brickWidth = width / numberOfBricks;
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
                bricks.push(brick);
            }
        }

        for (let i = 0; i < gameData.firstPlatformLevel1.length; i++) {
            firstFloor = gameData.firstPlatformLevel1[i];

            let numberOfBricks = 50;
            let brickWidth = width / numberOfBricks;
            let brickHeight = 20;
            for (let j = 0; j < numberOfBricks; j++) {
                let brickX = (firstFloor.x / 2) + (j * brickWidth);
                for (let k = 800; k < 1200; k+=20) {
                    let brickY = k;
                    let firstFloorBrick = createBrick(brickX, brickY, brickWidth, brickHeight, 2);
                    firstFloorBrick.addImage(floorImage);
                    firstBricks.push(firstFloorBrick);
                }
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

       /* for (let i = 0; i < gameData.floatingPlatformsLevel1.length; i++) {
            let floatingPlatformData = gameData.floatingPlatformsLevel1[i];
            floatingPlatform = createBrick(floatingPlatformData.x, floatingPlatformData.y, 200, 20, 2);
            floatingPlatform.color = color("blue");
            floatingPlatforms.push(floatingPlatform);
        }*/
        loadSteaksLevel1();
        loadChickenLevel1();
        makeMovingPlatforms();
        leftWall = new Sprite(5, height / 2, 10, height + 1200, 'static');
        leftWall.color = "grey";
        rightWall = new Sprite(width, height / 2, 20, height + 1200, 'static');
        rightWall.color = "grey";
        dogBoneSprite = new Sprite(middlePlatform.position.x, middlePlatform.position.y - 20, 'static');
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
        initialEnemies = [];
        enemies = [];
        chickens = [];
        poops = [];
        steaks = [];
        firstBricks = [];
        makePlayer();
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
        for (let i = 0; i < gameData.firstPlatformLevel2.length; i++) {
            firstFloor = gameData.firstPlatformLevel2[i];

            let numberOfBricks = 50;
            let brickWidth = width / numberOfBricks;
            let brickHeight = 20;
            for (let j = 0; j < numberOfBricks; j++) {
                let brickX = (firstFloor.x / 2) + (j * brickWidth);
                for (let k = 800; k < 1200; k+=20) {
                    let brickY = k;
                    let firstFloorBrick = createBrick(brickX, brickY, brickWidth, brickHeight, 2);
                    firstFloorBrick.addImage(floorImage);
                    firstBricks.push(firstFloorBrick);
                }
            }
        }
        loadSteaksLevel2();
        loadChickenLevel2();
        makeMovingPlatforms();
        leftWall = new Sprite(5, height / 2, 10, height + 1200, 'static');
        leftWall.color = "grey";
        rightWall = new Sprite(width, height / 2, 20, height + 1200, 'static');
        rightWall.color = "grey";
        dogBoneSprite = new Sprite(middlePlatform.position.x, middlePlatform.position.y - 20, 'static');
        dogBoneSprite.addImage(dogBone);
        dogBoneSprite.scale = 1;
        isLevel2Init = true;
    }
}

function loadMainMenu() {
    enemies = [];
    chickens = [];
    poops = [];
    steaks = [];
    bricks = [];
    initialEnemies = [];
    prevScreen = false;
    isLevel1Init = false;
    isLevel2Init = false;
    level2Timer = 0;
    endLevel2Timer = 0;
    creditTimer = 0;
    startGameButton.show();
    startGameButton.mouseClicked(changeCurrentScreenToLoading);
    if (!userWantsReplay) {
        wantReplayButton.show();
    }
    gameSplash = image(gameLogo, 100, 100);
}

function handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
		player.position.x += -2.5
        player.changeAni('run');
        player.mirror.x = true;
	} else if (kb.pressed(' ') && canAttack > 0) {
        makePoop();
    } else if (keyIsDown(RIGHT_ARROW)) {
		player.position.x += 2.5;
        player.changeAni('run');
        player.mirror.x = false;
	} else if (kb.pressed(UP_ARROW) && !player.isJumping) {
        jumpSound.setVolume(0.25);
        jumpSound.rate(1);
        jumpSound.play();
        player.vel.y = -5;
        player.isJumping = true;
        //player.changeAni('jump');
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
    removePlatforms();
    if (prevScreen == "LEVEL1") {
        level2Timer += 0.25;
        background('black');
        fill(color('white'));
        text("You beat Level 1, Here is Level 2!", width / 2, height / 2);
        text("Chicken Score: "+chickenScore, width / 2, height / 2 + 200);
        lifeSprite = image(lifeImage, width / 2, 400);
        text(lives, (width / 2) + 30, 410);
        if (level2Timer >= 50) {
            CURRENTSCREEN = "LOADING";
        }
    }
    else {
        endLevel2Timer += 0.25;
        background('black');
        fill(color('white'));
        text("You beat Level 2!", width / 2, height / 2);
        text("Chicken Score: "+chickenScore, width / 2, height / 2 + 200);
        lifeSprite = image(lifeImage, width / 2, 400);
        text(lives, (width / 2) + 30, 410);
        if (endLevel2Timer >= 50) {
            CURRENTSCREEN = "CREDITS";
        }
        //console.log("SCOREBOARD AFTER LEVEL2");
    }
}

function resetLevel() {
    hasLevelReset = true;
    for (let i = 0; i < bricks.length; i++) {
        bricks[i].remove();
        bricks[i] = createBrick(bricks[i].initialX, bricks[i].initialY, bricks[i].initialWidth, bricks[i].initialHeight, bricks[i].isUnbreakable);
        if (bricks[i].isUnbreakable == 1) {
            bricks[i].addImage(brickUnbreak);
        } else {
            bricks[i].addImage(brickImage);
        }
    }
    for (let i = 0; i < firstBricks.length; i++) {
        firstBricks[i].remove();
        firstBricks[i] = createBrick(firstBricks[i].initialX, firstBricks[i].initialY, firstBricks[i].initialWidth, firstBricks[i].initialHeight, 2);
        firstBricks[i].addImage(floorImage);
    }

    for (let j = 0; j < poops.length; j++) {
        poops[j].remove();
    }
    leftWall.remove();
    rightWall.remove();
    removePlatforms();
    makeMovingPlatforms();
    dogBoneSprite.remove();
    dogBoneSprite = new Sprite(middlePlatform.position.x, middlePlatform.position.y - 20, 'static');
    dogBoneSprite.addImage(dogBone);
    dogBoneSprite.scale = 1;
    leftWall = new Sprite(5, height / 2, 10, height + 1200, 'static');
    leftWall.color = "grey";
    rightWall = new Sprite(width, height / 2, 20, height + 1200, 'static');
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
    for (let i = 0; i < steaks.length; i++) {
        steaks[i].remove();
        steaks[i] = new Sprite(initialSteaks[i].x, initialSteaks[i].y, 5, 5, 'dynamic');
        steaks[i].scale = 1.5;
        steaks[i].addImage(steakImage);
    }
    for (let i = 0; i < chickens.length; i++) {
        chickens[i].remove();
        chickens[i] = new Sprite(initialChickens[i].x, initialChickens[i].y, 5, 5, 'dynamic');
        chickens[i].scale = 1.5;
        chickens[i].addImage(chickenImage);
    }

    chickenScore = 0;
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
    poop = new Sprite(player.position.x, player.position.y, 'dynamic');
    poop.diameter = 15;
    poop.color = color(123, 63, 0);
    poops.push(poop);
    canAttack -= 1;
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
        for (let i = 0; i < steaks.length; i++) {
            steaks[i].remove();
        }
        for (let i = 0; i < firstBricks.length; i++) {
            firstBricks[i].remove();
        }
        for (let i = 0; i < chickens.length; i++) {
            chickens[i].remove();
        }
        initialEnemies = [];
        enemies = [];
        poops = [];
        initialChickens = [];
        background('black');

        CURRENTSCREEN = "MAINMENU";
    }
}

function changeCurrentScreenToLevelOne() {
    CURRENTSCREEN = "LEVEL1";
}

function changeCurrentScreenToLoading() {
    CURRENTSCREEN = "LOADING";
}

function changeCurrentScreenToLevelTwo() {
    CURRENTSCREEN = "LEVEL2";
}

function changeCurrentScreenToReplay() {
    CURRENTSCREEN = "UPLOAD";
}

function loadSteaksLevel1() {
    for (let i = 0; i < gameData.steakLocationsLevel1.length; i++) {
        let steak = new Sprite(random(6,500),gameData.steakLocationsLevel1[i].y, 5, 5, 'dynamic');
        steak.image = steakImage;
        steak.scale = 1.5;
        initialSteak = steak
        steaks.push(steak);
        initialSteaks.push(initialSteak);
    }
}

function loadSteaksLevel2() {
    for (let i = 0; i < gameData.steakLocationsLevel1.length; i++) {
        let steak = new Sprite(random(6,500),gameData.steakLocationsLevel1[i].y, 5, 5, 'dynamic');
        steak.image = steakImage;
        steak.scale = 1.5;
        initialSteak = steak
        steaks.push(steak);
        initialSteaks.push(initialSteak);
    }
}

function makePlayer() {
    canAttack = 0;
    lives = 3;
    player = new Sprite(500, 750, 32, 26);  
    player.spriteSheet = playerSpriteImage;
    player.anis.offset.x = 1;
    player.debug = true;
    player.addAnis({
        idle: {row: 1, frames: 1},
        run: {row: 1, frames: 6}
        //jump: {row: 2, frames: 5}
    });
    player.rotationLock = true;
    player.changeAni('idle');
    // player.diameter = 35;
    player.isJumping = false;
}

function getGameState() {
    let state = {
        player: {
            x: player.position.x,
            y: player.position.y
        },
        enemies: [],
        steaks: [],
        poops: [],
        bricks: [],
        chickens: [],
        levelReset: false
    };
    if (hasLevelReset) {
        state.levelReset = true;
    }
    for (let i = 0; i < bricks.length; i++) {
        state.bricks.push({
            x: bricks[i].position.x,
            y: bricks[i].position.y,
            isUnbreakable: bricks[i].isUnbreakable,
        });
    }

    for (let i = 0; i < enemies.length; i++) {
        state.enemies.push({
            x: enemies[i].position.x,
            y: enemies[i].position.y
        });
    }

    for (let i = 0; i < steaks.length; i++) {
        state.steaks.push({
            x: steaks[i].position.x,
            y: steaks[i].position.y
        });
    }

    for (let i = 0; i < poops.length; i++) {
        state.poops.push({
            x: poops[i].position.x,
            y: poops[i].position.y
        });
    }

    for (let i = 0; i < chickens.length; i++) {
        state.chickens.push({
            x: chickens[i].position.x,
            y: chickens[i].position.y
        });
    }
    replayData.push(state);
}

function saveReplayToJSON() {
    saveJSON(replayData, "replay.json");
}

function replay() {
    replayButton.hide();
    startGameButton.hide();
    background('grey');
    startReplay();
    // My JSONReplayData variable is an Object! not an array!
    count = Object.keys(JSONReplayData).length;
    if (replayIndex < count) {
        recreateGameState(JSONReplayData[replayIndex]);
        isReplayInit = false;
    } 
}

function startReplay() {
    replayIndex++;
    isReplaying = true;
    replayLevel1IsInit = false;
}

function recreateGameState(state) {
    for (let i = 0; i < state.bricks.length; i++) {
        if (bricks[i]) {
			bricks[i].position.x = state.bricks[i].x;
			bricks[i].position.y = state.bricks[i].y;
			bricks[i].isUnbreakable = state.bricks[i].isUnbreakable;
        } else {
            let numberOfBricks = 50;
            let brickWidth = width / numberOfBricks;
            let brickHeight = 20;
            bricks[i] = createBrick(state.bricks[i].x, state.bricks[i].y, brickWidth, brickHeight, 'static');
            //brick.index = i;
            if (state.bricks[i].isUnbreakable == 1) {
                bricks[i].addImage(brickUnbreak);
            } else {
                bricks[i].addImage(brickImage);
            }
        }
    }
    for (let i = 0; i < state.enemies.length; i++) {
        if (enemies[i]) {
            enemies[i].position.x = state.enemies[i].x;
            enemies[i].position.y = state.enemies[i].y;
            collisionCheckReplay(state);
        } else {
            let enemy = new Sprite(state.enemies[i].x, state.enemies[i].y, 80, 40, 'dynamic');
            enemy.spriteSheet = snakeImage;
            //enemy.scale = 1;
            enemy.index = i;
            enemy.anis.offset.x = 1;
            enemy.debug = true;
            enemy.scale = 1;
            enemy.addAnis({
                walk: {row: 3, frames: 4}
            });
            enemy.changeAni('walk');
            enemy.rotationLock = true;
            enemy.moveValue = 1;
            enemies.push(enemy);
        }
    }
    for (let i = 0; i < state.steaks.length; i++) {
        if (steaks[i]) {
            steaks[i].position.x = state.steaks[i].x;
            steaks[i].position.y = state.steaks[i].y;
        } else {
            let steak = new Sprite(state.steaks[i].x, state.steaks[i].y, 5, 5, 'dynamic');
            steak.image = steakImage;
            steak.scale = 1.5;
            steaks.push(steak);
        }
    }

    for (let i = 0; i < state.chickens.length; i++) {
        if (chickens[i]) {
            chickens[i].position.x = state.chickens[i].x;
            chickens[i].position.y = state.chickens[i].y;
        } else {
            let chicken = new Sprite(state.chickens[i].x, state.chickens[i].y, 5, 5, 'dynamic');
            chicken.image = chickenImage;
            chicken.scale = 1.5;
            chickens.push(chicken);
        }
    }

    
    if (!isWallInit) {
        for (let i = 0; i < gameData.firstPlatformLevel1.length; i++) {
            firstFloor = gameData.firstPlatformLevel1[i];
    
            let numberOfBricks = 50;
            let brickWidth = width / numberOfBricks;
            let brickHeight = 20;
            for (let j = 0; j < numberOfBricks; j++) {
                let brickX = (firstFloor.x / 2) + (j * brickWidth);
                for (let k = 800; k < 1200; k+=20) {
                    let brickY = k;
                    let firstFloorBrick = createBrick(brickX, brickY, brickWidth, brickHeight, 2);
                    firstFloorBrick.addImage(floorImage);
                    firstBricks.push(firstFloorBrick);
                }
            }
        }
        leftWall = new Sprite(5, height / 2, 10, height + 1200, 'static');
        leftWall.color = "grey";
        rightWall = new Sprite(width, height / 2, 20, height + 1200, 'static');
        rightWall.color = "grey";
        makePlayer();
        makeMovingPlatforms();
        dogBoneSprite = new Sprite(middlePlatform.position.x, middlePlatform.position.y - 20, 'static');
        dogBoneSprite.addImage(dogBone);
        dogBoneSprite.scale = 1;
        collisionCheck();
        isWallInit = true;
    }
    movePlatforms();
    player.position.x = state.player.x;
    player.position.y = state.player.y;
    camera.y = player.y;
    for (let i = 0; i < state.poops.length; i++) {
        if (poops[i]) {
            poops[i].position.x = state.poops[i].x;
            poops[i].position.y = state.poops[i].y;
        } else {
            poop = new Sprite(player.position.x, player.position.y, 'dynamic');
            poop.diameter = 15;
            poop.color = color(123, 63, 0);
            poops.push(poop);
        }
    }
}


function collisionCheckReplay(state) {
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
    }
    for (let i = 0; i < enemies.length; i++) {
        if (player.collide(enemies[i])) {
            deathSound.play();
            resetLevelReplay(state);
        }
    }

    

    if (player.collide(dogBoneSprite) && CURRENTSCREEN == "REPLAY") {
        eatSound.play();
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].remove();
        }
        for (let i = 0; i < bricks.length; i++) {
            bricks[i].remove();
            player.remove();
            dogBoneSprite.remove();
            leftWall.remove();
            rightWall.remove();
        }
        for (let i = 0; i < chickens.length; i++) {
            chickens[i].remove();
        }
        //allSprites.remove();
        for (let i = 0; i < steaks.length; i++) {
            steaks[i].remove();
        }
        for (let i = 0; i < firstBricks.length; i++) {
            firstBricks[i].remove();
        }
        for (let i = 0; i < poops.length; i++) {
            poops[i].remove();
        }
        removePlatforms();
        replayButton.show();
        background('black');
        CURRENTSCREEN = "MAINMENU";
    }

    // Check for collision of snakes with steaks. 
    for (let i = 0; i < enemies.length; i++) {
        for (let k = 0; k < steaks.length; k++) {
            if (enemies[i].collide(steaks[k])) {
                // Check whether the snake is coming from the left or right
                // Handle between the two cases.
                if (enemies[i].x > steaks[k].x) {
                    enemies[i].moveValue = 1;
                    enemies[i].mirror.x = false;
                } else {
                    enemies[i].moveValue = -1;
                    enemies[i].mirror.x = true;
                }
            }
        }
        for (let k = 0; k < chickens.length; k++) {
            if (enemies[i].collide(chickens[k])) {
                if (enemies[i].x > chickens[k].x) {
                    enemies[i].moveValue = 1;
                    enemies[i].mirror.x = false;
                } else {
                    enemies[i].moveValue = -1;
                    enemies[i].mirror.x = true;
                }
            }
        }

        // Check if snake collides with a poop, remove both poop and snake
        // from their respective arrays.
        for (let j = 0; j < poops.length; j++) {
            if (enemies[i].collide(poops[j])) {
                snakeDeathSound.play();
                enemies[i].remove();
                poops[j].remove();
            }
        }
    }
    
    for (let i = 0; i < steaks.length; i++) {
        if (player.collide(steaks[i])) {
            eatSound.play();
            steaks[i].remove();
        }
    }

    for (let i = 0; i < chickens.length; i++) {
        if (player.collide(chickens[i])) {
            eatSound.play();
            chickens[i].remove();
        }
    }
}

function loadJSONReplayFile(file) {
    if (file.subtype === 'json') { // check if file is json file
        // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        let reader = new FileReader(); // this is the file reader API in javascript.
        reader.onload = function (event) {
            // JSON.parse converts the JSON string and turns it into an object
            dataToConvert = JSON.parse(event.target.result);
            convertData(dataToConvert);
            //console.log(JSONReplayData);
        };
        reader.readAsText(file.file);
        uploadReplay.hide();
        CURRENTSCREEN = "REPLAY";
    } else {
        console.error('Not a valid JSON file!');
    }
}


// The convertData function takes in an input array, and converts it 
// into an object. Where I can index through it frame by frame.

// The map function turns the array elements in data into a key pair of index and item.
// The fromEntries function then turns the result into an object of which I can use.
function convertData(data) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
    JSONReplayData = Object.fromEntries(data.map((item, index) => [index, item]));
}

function loadChickenLevel1() {
    for (let i = 0; i < gameData.chickenLocationsLevel1.length; i++) {
        let chicken = new Sprite(random(6,500),gameData.chickenLocationsLevel1[i].y, 5, 5, 'dynamic');
        chicken.image = chickenImage;
        chicken.scale = 1.5;
        initialChicken = chicken
        chickens.push(chicken);
        initialChickens.push(initialChicken);
    }
}

function loadChickenLevel2() {
    for (let i = 0; i < gameData.chickenLocationsLevel2.length; i++) {
        let chicken = new Sprite(random(6,500),gameData.chickenLocationsLevel2[i].y, 5, 5, 'dynamic');
        chicken.image = chickenImage;
        chicken.scale = 1.5;
        initialChicken = chicken
        chickens.push(chicken);
        initialChickens.push(initialChicken);
    }
}

function resetLevelReplay(state) {
    if (!initReplayLevel) {
        for (let i = 0; i < state.bricks.length; i++) {
            bricks[i].remove();
            let numberOfBricks = 50;
            let brickWidth = width / numberOfBricks;
            let brickHeight = 20;
            bricks[i] = createBrick(state.bricks[i].x, state.bricks[i].y, brickWidth, brickHeight, state.bricks[i].isUnbreakable);
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
        removePlatforms();
        makeMovingPlatforms();
        dogBoneSprite.remove();
        dogBoneSprite = new Sprite(middlePlatform.position.x, middlePlatform.position.y - 20, 'static');
        dogBoneSprite.addImage(dogBone);
        dogBoneSprite.scale = 1;
        leftWall = new Sprite(5, height / 2, 10, height + 1200, 'static');
        leftWall.color = "grey";
        rightWall = new Sprite(width, height / 2, 20, height + 1200, 'static');
        rightWall.color = "grey";
    
        for (let i = 0; i < state.enemies.length; i++) {
            enemies[i].remove();
            enemies[i] = new Sprite(state.enemies[i].x, state.enemies[i].y, 80, 40, 'dynamic');
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
        for (let i = 0; i < state.steaks.length; i++) {
            steaks[i].remove();
            steaks[i] = new Sprite(state.steaks[i].x, state.steaks[i].y, 5, 5, 'dynamic');
            steaks[i].scale = 1.5;
            steaks[i].addImage(steakImage);
        }
        for (let i = 0; i < state.chickens.length; i++) {
            chickens[i].remove();
            chickens[i] = new Sprite(state.chickens[i].x, state.chickens[i].y, 5, 5, 'dynamic');
            chickens[i].scale = 1.5;
            chickens[i].addImage(chickenImage);
        }
        initReplayLevel = true;
    }  
}

function makeMovingPlatforms() {
    leftPlatform = new Sprite(250, -100, 100, 20, 'static');
    leftPlatform.color = color("blue");
    rightPlatform = new Sprite(750, -100, 100, 20, 'static');
    rightPlatform.color = color("blue");
    middlePlatform = new Sprite(500, -200, 100, 20, 'static');
    middlePlatform.color = color("gold");
}

function movePlatforms() {
    platformMoveCount += 0.5;
    platformMoveCount2 += 0.5;
    if (platformMoveCount >= 50) {
        if (leftPlatform.position.x == 250) {
            leftPlatform.position.x = 350;
            platformMoveCount = 0;
        } else if (leftPlatform.position.x == 350) {
            leftPlatform.position.x = 250;
            platformMoveCount = 0;
        }
    }
    if (platformMoveCount2 >= 50) {
        if (rightPlatform.position.x == 750) {
            rightPlatform.position.x = 650;
            platformMoveCount2 = 0;
        } else if (rightPlatform.position.x == 650) {
            rightPlatform.position.x = 750;
            platformMoveCount2 = 0;
        }
    }
}

function removePlatforms() {
    leftPlatform.remove();
    rightPlatform.remove();
    middlePlatform.remove();
}

function enableReplayForLevel1() {
    userWantsReplay = true;
    wantReplayButton.hide();
}