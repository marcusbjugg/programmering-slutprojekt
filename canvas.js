let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 18;
canvas.height = window.innerHeight - 20;

let context = canvas.getContext("2d");

let count = 0;
let bullets = [];
let canShoot = true; // anti-skott spammning
let keys = {};

let spaceship = {
    posY: 10,
    posX: 10,
    speedX: 15,
    speedY: 10,
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

// ladda bilder
const idleImage = new Image();
idleImage.src = "rymdskepp/Fighter/Move.png";

const bulletImage = new Image();
bulletImage.src = "rymdskepp/Fighter/Charge_1.png";

// vänta på att båda bilderna laddas innan spelet börjar
let imagesLoaded = 0;

function tryStartGame() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        requestAnimationFrame(update); // när båda bilder är laddade
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

bulletImage.onload = () => {
    tryStartGame();
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
    if (event.key === " ") {
        canShoot = true; // anti-skott spammning
    }

    keys[event.key] = false;
});

function update(timestamp) {
    if (timestamp - lastTimestamp < timestep) {
        requestAnimationFrame(update);
        return;
    }

    const state = State.getState("idle");
    const spriteWidth = state.frameWidth * spaceship.scale;
    const spriteHeight = state.frameHeight * spaceship.scale;

    if (keys["d"] && spaceship.posX + spriteWidth + spaceship.speedX <= canvas.width - 0) {
        spaceship.posX += spaceship.speedX;
    }

    if (keys["a"] && spaceship.posX - spaceship.speedX >= -48) {
        spaceship.posX -= spaceship.speedX;
    }

    if (keys["s"] && spaceship.posY + spriteHeight + spaceship.speedY <= canvas.height - -30) {
        spaceship.posY += spaceship.speedY;
    }

    if (keys["w"] && spaceship.posY - spaceship.speedY >= -30) {
        spaceship.posY -= spaceship.speedY;
    }

    clearCanvas();
    animate(state);
    updateBullets();
    drawBullets();

    lastTimestamp = timestamp;
    requestAnimationFrame(update);
}