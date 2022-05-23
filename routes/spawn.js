var express = require('express');
var router = express.Router();
router.use(express.static("public"));

/* GET cars data. */
router.get('/car', function(req, res, next) {
    //res.type('json');
    var startPos = randomStart();
    res.json({
        color: randomColor(),
        start: startPos['start'],
        v: 2*startPos['dir'],
        posX: startPos['posX'],
        posY: startPos['posY'],
        axis: startPos['axis']
    });
});

function randomColor(){
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// Assume Canvas is always 1200x700 for now
function randomStart(){
    var side = Math.floor(Math.random()*4 + 1);
    switch(side){
        case 1: // Top
            return {start:1,posX:565,posY:0,axis:'y',dir:1};
        case 2: // Right
            return {start:2,posX:1200,posY:315,axis:'x',dir:-1};
        case 3: // Bottom
            return {start:3,posX:615,posY:700,axis:'y',dir:-1};
        case 4: // Left
            return {start:4,posX:0,posY:365,axis:'x',dir:1};
    }
}

module.exports = router;
