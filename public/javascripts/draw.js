// Setup
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

// Get cars array from server
var cars = [];
var drawInterval;

// Intersection orientation
// TRBL = 1234 (24 means right and left have green light)
var intersection = {orient:'24', source:'images/2l-light-24.jpg'};

// Spawn a car every second
var carSpawnInterval = setInterval(spawnCar, 1000);

// Draw canvas every frame (100/60 ms = 60 fps)
var drawInterval = setInterval(draw, 1000/60);
function draw(){
    //console.log('drawing');
    // Load images
    var imagePromises = [];
    var imageInfo = [['images/road-horiz.jpg', 'road-horiz'], ['images/road-vertical.jpg', 'road-vert'], [intersection['source'], 'intersection']];
    var images = {};
    for(var i=0; i<imageInfo.length; i++){
        imagePromises.push(
            new Promise( (resolve, reject) => {
                var name = imageInfo[i][1];
                images[name] = new Image();
                images[name].src = imageInfo[i][0];
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
                ctx.fillStyle = car['color'];
                if(car['axis'] == 'x'){// Horizontal
                    ctx.fillRect(car['posX'], car['posY'], 55, 20);
                    move(car);
                    // Despawn car when it reaches the end
                    if(car['posX'] > canvas.width || car['posX'] < 0){
                        despawn(car);
                    }
                } else{ // Vertical
                    ctx.fillRect(car['posX'], car['posY'], 20, 55);
                    move(car);
                    // Despawn car when it reaches the end
                    if(car['posY'] > canvas.height || car['posY'] < 0){
                        despawn(car);
                    }
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

function move(car){
    if(car['axis'] == 'x'){ // x-axis (left-right)
        if(intersection['orient'] == '24'){// green light
            car['posX'] += car['origV'];
            return;
        } else{// red light: slow down and stop
            // If already stopped, don't do anything else
            if(car['v'] == 0){
                return;
            }
            // If already past the intersection, keep moving
            if((car['start'] == 4 && car['posX'] > 475) || (car['start'] == 2 && car['posX'] < 675)){
                car['posX'] += car['origV'];
                return;
            }
            // Find number of cars between this car and stop light
            var carsInFront = 0;
            for(var i=0; i<cars.length; i++){
                if(car['start'] == 4){
                    if(cars[i]['start'] == car['start'] && cars[i]['posX'] > car['posX'] && cars[i]['posX'] < 475){
                        carsInFront++;
                    }
                } else {
                    if(cars[i]['start'] == car['start'] && cars[i]['posX'] < car['posX'] && cars[i]['posX'] > 675){
                        carsInFront++;
                    }
                }
            }
            // Leave room for number of cars in front of this one
            // Speed starts at 2, then decreases to 0 by the time it gets to the intersection, or 50*number of cars in front
            if(car['start'] == 2){ // Started at right (travelling left)
                car['v'] = -1 * (Math.pow(car['posX'], 2)/(Math.pow(675+(carsInFront*75), 2)/2)) + 2;
            } else{ // Started at left (travelling right)
                car['v'] = -1 * (Math.pow(car['posX'], 2)/(Math.pow(475-(carsInFront*75), 2)/2)) + 2;
            }
            car['posX'] += car['v'];
        }
    }
    
    else { // y-axis (up-down)
        if(intersection['orient'] == '13'){// green light
            car['posY'] += car['origV'];
            return;
        } else{// slow down and stop
            // If already stopped, don't do anything else
            if(car['v'] == 0){
                return;
            }
            // If already past the intersection, keep moving
            if(car['start'] == 1 && car['posY'] > 225 || car['start'] == 3 && car['posY'] < 425){
                car['posY'] += car['origV'];
                return;
            }
            // Find number of cars between this car and stop light
            var carsInFront = 0;
            for(var i=0; i<cars.length; i++){
                if(car['start'] == 1){
                    if(cars[i]['start'] == car['start'] && cars[i]['posY'] > car['posY'] && cars[i]['posY'] < 350){
                        carsInFront++;
                    }
                } else {
                    if(cars[i]['start'] == car['start'] && cars[i]['posY'] < car['posY'] && cars[i]['posY'] > 350){
                        carsInFront++;
                    }
                }
            }
            // Leave room for number of cars in front of this one
            // Speed starts at 2, then decreases to 0 by the time it gets to the intersection, or 50*number of cars in front
            if(car['start'] == 1){ // Started at top (travelling down)
                car['v'] = -1 * (Math.pow(car['posY'], 2)/(Math.pow(225-(carsInFront*75), 2)/2)) + 2;
            } else{ // Started at bottom (travelling up)
                car['v'] = -1 * (Math.pow(car['posY'], 2)/(Math.pow(425+(carsInFront*75), 2)/2)) + 2;
            }
            car['posY'] += car['v'];
        }
    }
}

function switchInters(){
    if(intersection['orient'] == '13'){
        intersection['orient'] = '24';
        intersection['source'] = 'images/2l-light-24.jpg';
    } else{
        intersection['orient'] = '13';
        intersection['source'] = 'images/2l-light-13.jpg';
    }
}