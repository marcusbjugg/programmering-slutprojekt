let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 18;
canvas.height = window.innerHeight - 20;

let context = canvas.getContext("2d"); 
let count = 0
let spaceship = {
    posY: 10,
    posX: 10,
    speed: 10,
    scale: 1
  }


const State = {
    states: {},
    generateState: function(name, startIndex, endIndex, spriteSheetSrc, frameWidth, frameHeight) {
        if(!this.states[name]) {
            const image = new Image();
            image.src = spriteSheetSrc;
            this.states[name] = {
                frameIndex: startIndex,
                startIndex: startIndex,
                endIndex: endIndex,
                spritesheet: image,
                frameWidth: frameWidth,
                frameHeight: frameHeight
            };
        }
    },
    getState: function(name) {
        if (this.states[name]) {
            return this.states[name];
        }
    }
};

State.generateState("idle", 0, 5,"rymdskepp/Fighter/Move.png", 125, 192)
let lastTimestamp = 0,
      maxFPS = 1000,
      timestep = 1000 / maxFPS 

let keys = {}

function animate(state) {
    const frameWidth = state.frameWidth;
    const frameHeight = state.frameHeight;
    const spriteDrawWidth = frameWidth * spaceship.scale;
    const spriteDrawHeight = 150 * spaceship.scale;

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

    count ++;
    if(count > timestep) {
        state.frameIndex ++;
        count = 0;
    }

    if(state.frameIndex > state.endIndex) {
        state.frameIndex = state.startIndex;
    }
}

function drawSpaceship(spaceship) {
    context.fillStyle = spaceship.color;
    context.fillRect(spaceship.posX, spaceship.posY, spaceship.width, spaceship.height)
}

function clearCanvas() {
    context.fillStyle = "rgba(0, 0, 0, 0.0)";
    context.clearRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener("keydown", function(event) {
    keys[event.key] = true; 
})

document.addEventListener("keyup", function(event) {
    keys[event.key] = false;
})

function update(timestamp) {
    if (timestamp - lastTimestamp < timestep) {
        // Vi ska vänta med att rita så vi avbryter funktionen.
        requestAnimationFrame(update)
        return
      }

    if (keys["d"]) { spaceship.posX += spaceship.speed; }
    if (keys["a"]) { spaceship.posX -= spaceship.speed; }
    if (keys["s"]) { spaceship.posY += spaceship.speed; }
    if (keys["w"]) { spaceship.posY -= spaceship.speed; }

    console.log("Uppdaterar");
    clearCanvas();
    animate(State.getState("idle"));
    requestAnimationFrame(update);
}
 
requestAnimationFrame(update)