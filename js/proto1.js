// Setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

function drawBackground(){
    // Draw road
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 200, 800, 200);
}

// Draw a car moving across the screen
carPos = 0;
var carVel = 1; // Car velocity (keep it simple for now)

// Draw canvas every frame (100/60 ms = 60 fps)
var redrawInterval = setInterval(draw, 1000/60);
function draw(){
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw background
    drawBackground();

    // Car
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(carPos, 300, 50, 20);
    carPos += carVel;
}