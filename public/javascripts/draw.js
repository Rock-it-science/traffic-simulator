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
    var imagePromises = [];
    var imageInfo = [['images/road-horiz.jpg', 'road-horiz'], ['images/road-vertical.jpg', 'road-vert'], ['images/2l-light-24.jpg', 'intersection']];
    var images = {};
    for(var i=0; i<imageInfo.length; i++){
        imagePromises.push(
            new Promise( (resolve, reject) => {
                var name = imageInfo[i][1];
                images[name] = new Image();
                images[name].src = imageInfo[i][0];
                //console.log('images: ' + images);
                images[name].addEventListener('load', function(){
                    resolve(true);
                });
            })
        )
    }

    Promise.all(imagePromises).then(result => { // When images are loaded, continue drawing
        //console.log('Road image loaded');
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw road - 2-lane traffic light intersection
        // Draw road dynamically based on canvas size, assuming 100x100px tile size
        for(var y=-50; y<canvas.height; y+=100){
            ctx.drawImage(images['road-vert'], canvas.width/2-50, y);
        }
        for(var x=-50; x<canvas.width; x+=100){
            ctx.drawImage(images['road-horiz'], x, canvas.height/2-50);
        }

        ctx.drawImage(images['intersection'], canvas.width/2-50, canvas.height/2-50);

        // Cars
        if(cars.length == 0){
            console.log('no cars to draw');
        } else {
            for(var i=0; i<cars.length; i++){
                var car = cars[i];
                //console.log('drawing car:' + JSON.stringify(car));
                ctx.fillStyle = car['color'];
                ctx.fillRect(car['posX'], 315, 55, 20);
                car['posX'] += car['v'];

                // Despawn car when it reaches the end of the car (only for x so far)
                if(car['posX'] >= canvas.width){
                    despawn(car);
                }
            }
        }
    });
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
    cars.splice(cars.indexOf(car), 1);
    // Nothing else to do yet
}

function carInSpawnArea(){
    for(var i=0; i<cars.length; i++){
        if(cars[i].posX <= 50){
            return true;
        }
    }
    return false;
}