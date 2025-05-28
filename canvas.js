let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 18;
canvas.height = window.innerHeight - 20;

let context = canvas.getContext("2d");
let bullets = [];
let canShoot = true;
let keys = {};
let count = 0;
let points = 0
let pointDisplay = document.getElementById("points")

let spaceship = {
    posY: 10,
    posX: 10,
    speedX: 15,
    speedY: 10,
    scale: 0.7,
    state: "idle",
    alive: true
};

let enemyShip1 = {
    posY: 10,
    posX: 100,
    speed: 0,
    scale: 0.4,
    state: "enemy",
    alive: true
};

let enemies = [];

const State = {
    states: {},
    getState: function(name) {
        return this.states[name];
    }
};

let lastTimestamp = 0;
let maxFPS = 60;
let timestep = 1000 / maxFPS;

const idleImage = new Image();
idleImage.src = "rymdskepp/Fighter/Move.png";

const bulletImage = new Image();
bulletImage.src = "rymdskepp/Fighter/Charge_1.png";

const turnLeftImage = new Image();
turnLeftImage.src = "rymdskepp/Fighter/Turn_1.png";

const turnRightImage = new Image();
turnRightImage.src = "rymdskepp/Fighter/Turn_2.png";

const idleEnemyImage = new Image();
idleEnemyImage.src = "rymdskepp/Corvette/Move.png";

const shootSound = new Audio("rymdskepp/Ljud/shoot.mp3");

let imagesLoaded = 0;
function tryStartGame() {
    imagesLoaded++;
    if (imagesLoaded === 5) {
        requestAnimationFrame(update);
        setInterval(spawnEnemy, 2000);
    }
}

idleImage.onload = () => {
    State.states["idle"] = {
        frameIndex: 0,
        startIndex: 0,
        endIndex: 5,
        spritesheet: idleImage,
        frameWidth: 125,
        frameHeight: 192
    };
    tryStartGame();
};

turnLeftImage.onload = () => {
    State.states["turnLeft"] = {
        frameIndex: 0,
        startIndex: 0,
        endIndex: 3,
        spritesheet: turnLeftImage,
        frameWidth: 125,
        frameHeight: 192
    };
    tryStartGame();
};

turnRightImage.onload = () => {
    State.states["turnRight"] = {
        frameIndex: 0,
        startIndex: 0,
        endIndex: 3,
        spritesheet: turnRightImage,
        frameWidth: 125,
        frameHeight: 192
    };
    tryStartGame();
};

idleEnemyImage.onload = () => {
    State.states["enemy"] = {
        frameIndex: 0,
        startIndex: 0,
        endIndex: 5,
        spritesheet: idleEnemyImage,
        frameWidth: 150,
        frameHeight: 192,
        flipVertically: true
    };
    tryStartGame();
};

bulletImage.onload = () => {
    tryStartGame();
};

function spawnEnemy() {
    const posX = Math.random() * (canvas.width - 150);
    enemies.push({
        posX,
        posY: -200,
        speed: 2 + Math.random() * 2,
        scale: 0.4,
        state: "enemy",
        alive: true
    });
}

function animate(state, entity) {
    if (!state || !state.spritesheet.complete || !entity.alive) return;

    const frameWidth = state.frameWidth;
    const frameHeight = state.frameHeight;
    const spriteDrawWidth = frameWidth * entity.scale;
    const spriteDrawHeight = frameHeight * entity.scale;
    const frameY = state.frameIndex * frameHeight;

    context.save();
    if (state.flipVertically) {
        context.translate(entity.posX + spriteDrawWidth / 2, entity.posY + spriteDrawHeight / 2);
        context.rotate(Math.PI);
        context.translate(-spriteDrawWidth / 2, -spriteDrawHeight / 2);
        context.drawImage(
            state.spritesheet,
            0, frameY, frameWidth, frameHeight,
            0, 0, spriteDrawWidth, spriteDrawHeight
        );
    } else {
        context.drawImage(
            state.spritesheet,
            0, frameY, frameWidth, frameHeight,
            entity.posX, entity.posY,
            spriteDrawWidth, spriteDrawHeight
        );
    }
    context.restore();

    count++;
    if (count > maxFPS / 10) {
        state.frameIndex++;
        count = 0;
    }
    if (state.frameIndex > state.endIndex) {
        state.frameIndex = state.startIndex;
    }
}

function shootBullet() {
    bullets.push({
        x: spaceship.posX + 57.5,
        y: spaceship.posY + 65,
        speed: 15,
        width: 20,
        height: 13
    });
    shootSound.currentTime = 0;
    shootSound.play();
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
    }
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function drawBullets() {
    for (let bullet of bullets) {
        context.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function checkBulletCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        if (
            bullet.x < enemyShip1.posX + 150 * enemyShip1.scale &&
            bullet.x + bullet.width > enemyShip1.posX &&
            bullet.y < enemyShip1.posY + 192 * enemyShip1.scale &&
            bullet.y + bullet.height > enemyShip1.posY &&
            enemyShip1.alive
        ) {
            enemyShip1.alive = false;
            bullets.splice(i, 1);
            points += 50;
            pointDisplay.innerHTML = `Points: ${points}`;
            break;
        }
        for (let enemy of enemies) {
            if (
                enemy.alive &&
                bullet.x < enemy.posX + 150 * enemy.scale &&
                bullet.x + bullet.width > enemy.posX &&
                bullet.y < enemy.posY + 192 * enemy.scale &&
                bullet.y + bullet.height > enemy.posY
            ) {
                enemy.alive = false;
                bullets.splice(i, 1);
                points += 50;
                pointDisplay.innerHTML = `Points: ${points}`;
                break;
            }
        }
    }
}

function updateEnemies() {
    for (let enemy of enemies) {
        if (enemy.alive) {
            enemy.posY += enemy.speed;
            if (enemy.posY > canvas.height) {
                enemy.alive = false;
            }
        }
    }
}

document.addEventListener("keydown", function(event) {
    if (!keys[event.key]) {
        keys[event.key] = true;
        if (event.key === " " && canShoot) {
            shootBullet();
            canShoot = false;
        }
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key === " ") canShoot = true;
    keys[event.key] = false;
});

function update(timestamp) {
    if (timestamp - lastTimestamp < timestep) {
        requestAnimationFrame(update);
        return;
    }

    const isMovingLeft = keys["a"];
    const isMovingRight = keys["d"];
    const isMovingUp = keys["w"];
    const isMovingDown = keys["s"];

    if (isMovingRight && spaceship.posX + spaceship.speedX <= canvas.width - 50)
        spaceship.posX += spaceship.speedX;
    if (isMovingLeft && spaceship.posX - spaceship.speedX >= -48)
        spaceship.posX -= spaceship.speedX;
    if (isMovingDown && spaceship.posY + spaceship.speedY <= canvas.height - 93)
        spaceship.posY += spaceship.speedY;
    if (isMovingUp && spaceship.posY - spaceship.speedY >= -30)
        spaceship.posY -= spaceship.speedY;

    spaceship.state = isMovingLeft && !isMovingRight
        ? "turnLeft"
        : isMovingRight && !isMovingLeft
        ? "turnRight"
        : "idle";

    checkBulletCollisions();
    updateEnemies();
    clearCanvas();
    animate(State.getState(spaceship.state), spaceship);
    animate(State.getState(enemyShip1.state), enemyShip1);
    for (let enemy of enemies) {
        animate(State.getState(enemy.state), enemy);
    }
    updateBullets();
    drawBullets();

    lastTimestamp = timestamp;
    requestAnimationFrame(update);
}
