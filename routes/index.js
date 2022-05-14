var express = require('express');
var router = express.Router();
router.use(express.static("public"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve('public/index.html'));
});

module.exports = router;
