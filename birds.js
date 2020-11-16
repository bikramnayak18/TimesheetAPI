var express = require('express')
var router = express.Router()
var timesheetService = require('./services/timesheetService');
// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/welcome', function (req, res) {
    var service = new timesheetService();
    res.send(service.welcomeMessage());  
})

module.exports = router