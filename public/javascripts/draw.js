// Setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

// Get cars array from server
var cars = {};
var drawInterval;

$.get( "/cars/cars", function(response) {
    //drawInterval = setInterval(draw, 1000/60);
    alert("Recieved: " + response);
})
    .fail(function() {
        alert( "Failed to get cars from server" );
});

// Draw canvas every frame (100/60 ms = 60 fps)

function draw(){
    // Load images
    const roadImg = new Image();
    roadImg.onload = function(){ // When road image is loaded, continue drawing
        //console.log('Road image loaded');
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw road
        var roadW = roadImg.naturalWidth / 3; // Divide natural dimensions by 3 to make road proper size for canvas
        var roadH = roadImg.naturalHeight / 3;
        var roadX = 0; // Road x position to be iterated
        while(roadX < canvas.width){
            //console.log(roadW +', ' + roadH + ', ' + roadX);
            ctx.drawImage(roadImg, roadX, 200, roadW, roadH);
            roadX += roadW;
        }

        // Car
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(carPos, 275, 50, 20);
        carPos += carVel;

        // Stop movement
        if(carPos >= canvas.width){
            clearInterval(drawInterval);
        }
    };
    roadImg.src = 'images/istock-road.jpg';
}
