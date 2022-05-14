// Setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

// Get cars array from server
var cars = [];
var drawInterval;

// Spawn a car every second
var carSpawnInterval = setInterval(spawnCar, 1000);

// Draw canvas every frame (100/60 ms = 60 fps)
var drawInterval = setInterval(draw, 1000/60);
function draw(){
    //console.log('drawing');
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

        // Cars
        if(cars.length == 0){
            console.log('no cars to draw');
        } else {
            for(var i=0; i<cars.length; i++){
                var car = cars[i];
                //console.log('drawing car:' + JSON.stringify(car));
                ctx.fillStyle = car['color'];
                ctx.fillRect(car['posX'], 275, 50, 20);
                car['posX'] += car['v'];

                // Despawn car when it reaches the end of the car (only for x so far)
                if(car['posX'] >= canvas.width){
                    cars.splice(cars.indexOf(car), 1);
                    despawn(car);
                }
            }
        }
    };
    roadImg.src = 'images/istock-road.jpg';
}

function spawnCar(){
    // Check if there is already in the spawn area (no lane considerations yet)
    if(!carInSpawnArea()){
        console.log('spawning car');
        $.getJSON( "/spawn/car", function(response) {
            console.log("Recieved: " + JSON.stringify(response));
            cars.push(response);
        })
            .fail(function() {
                alert( "Failure spawning car: server error" );
        });
        return;
    } else{
        console.log('Failure spawning car: car in spawn area');
        // TODO: add queue(?) for cars not spawned
    }
}

function despawn(car){
    console.log('despawning car: ' + JSON.stringify(car));
    // Nothing to do yet
}

function carInSpawnArea(){
    for(var i=0; i<cars.length; i++){
        if(cars[i].posX <= 50){
            return true;
        }
    }
    return false;
}