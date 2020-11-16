var express = require('express'), 
router = express.Router(),
timesheetService = require('../services/timesheetService').timesheetService();

router.get('/welcome',function(req,res,next){
    res.json("{'message':'hello'}");
})

