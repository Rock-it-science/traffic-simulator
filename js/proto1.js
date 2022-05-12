// Setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

// Draw a car moving across the screen
carPos = 0;
var carVel = 1; // Car velocity (keep it simple for now)

// Draw canvas every frame (100/60 ms = 60 fps)
var drawInterval = setInterval(draw, 1000/60);
function draw(){
    // Load images
    const roadImg = new Image();
    roadImg.onload = function(){
        console.log('Road image loaded');
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw background
        
        // Draw road
        var roadW = roadImg.naturalWidth / 3; // Divide natural dimensions by 3 to make road proper size for canvas
        var roadH = roadImg.naturalHeight / 3;
        var roadX = 0; // Road x position to be iterated
        console.log(roadW +', ' + roadH + ', ' + roadX);
        while(roadX < canvas.width){
            console.log(roadW +', ' + roadH + ', ' + roadX);
            ctx.drawImage(roadImg, roadX, 200, roadW, roadH);
            roadX += roadW;
        }

        // Car
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(carPos, 300, 50, 20);
        carPos += carVel;

        // Stop movement
        if(carPos >= 400){
            clearInterval(drawInterval);
        }
    };
    roadImg.src = 'img/istock-road.jpg';
}
