let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 18;
canvas.height = window.innerHeight - 20;

let context = canvas.getContext("2d");

let count = 0;
let bullets = [];
const bulletImage = document.querySelector(".bulletImage");

let spaceship = {
    posY: 10,
    posX: 10,
    speed: 15,
    scale: 0.7
};

const State = {
    states: {},
    getState: function(name) {
        return this.states[name];
    }
};

let lastTimestamp = 0;
let maxFPS = 60;
let timestep = 1000 / maxFPS;
let keys = {};

const idleImage = new Image();
idleImage.src = "rymdskepp/Fighter/Move.png";
idleImage.onload = () => {
    State.states["idle"] = {
        frameIndex: 0,
        startIndex: 0,
        endIndex: 5,
        spritesheet: idleImage,
        frameWidth: 125,
        frameHeight: 192
    };
    requestAnimationFrame(update); // när bilden har laddats
};

function animate(state) {
    if (!state.spritesheet.complete) return; // om bilden inte har laddats

    const frameWidth = state.frameWidth;
    const frameHeight = state.frameHeight;
    const spriteDrawWidth = frameWidth * spaceship.scale;
    const spriteDrawHeight = frameHeight * spaceship.scale;

    context.drawImage(
        state.spritesheet,
        0,
        state.frameIndex * frameHeight,
        frameWidth,
        frameHeight,
        spaceship.posX,
        spaceship.posY,
        spriteDrawWidth,
        spriteDrawHeight
    );

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
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
    }
    bullets = bullets.filter(bullet => bullet.y < canvas.width);
}

function drawBullets() {
    for (let bullet of bullets) {
        context.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", function(event) {
    if (!keys[event.key]) {
        keys[event.key] = true;

        if (event.key === " " && canShoot) {
            shootBullet();
            canShoot = false; // anti-skott spammning
        }
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;

    if (event.key === " ") {
        canShoot = true; // anti-skott spammning
    }
});

function update(timestamp) {
    if (timestamp - lastTimestamp < timestep) {
        requestAnimationFrame(update);
        return;
    }

    if (keys["d"]) { spaceship.posX += spaceship.speed; }
    if (keys["a"]) { spaceship.posX -= spaceship.speed; }
    if (keys["s"]) { spaceship.posY += spaceship.speed; }
    if (keys["w"]) { spaceship.posY -= spaceship.speed; }

    clearCanvas();
    animate(State.getState("idle"));
    updateBullets();
    drawBullets();

    lastTimestamp = timestamp;
    requestAnimationFrame(update);
}