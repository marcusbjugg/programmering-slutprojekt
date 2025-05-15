let canvas = document.getElementById("canvas");
canvas.width = window.innerWidth - 18;
canvas.height = window.innerHeight - 20;

let context = canvas.getContext("2d"); 

let spaceship = {
    posY: 10,
    posX: 10,
    speed: 10,
    scale: 1
}

let frameIndex = 7
const spriteSheet = new Image();
spriteSheet.src = "rymdskepp/Fighter/Move.png";
let count = 0

let lastTimestamp = 0,
      maxFPS = 60,
      timestep = 1000 / maxFPS // ms for each frame

    /**
     * timestamp är en inparameter som skickas in i funktionen av requestAnimationFrame()
     */

let keys = {}

function animate() {
    const frameWidth = 125;
    const frameHeight = 192;
    const spriteDrawWidth = frameWidth * spaceship.scale;
    const spriteDrawHeight = 150 * spaceship.scale;

    context.drawImage(
        spriteSheet,
        0,
        frameIndex * frameHeight,
        frameWidth,
        frameHeight,
        spaceship.posX,
        spaceship.posY,
        spriteDrawWidth,
        spriteDrawHeight
    );

    count ++;
    if(count > 10) {
        frameIndex ++;
        count = 0;
    }

    if(frameIndex > 5) {
        frameIndex = 0;
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
    animate()
    requestAnimationFrame(update);
}
 
requestAnimationFrame(update)