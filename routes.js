var express = require('express')
var router = express.Router()
var cors = require('cors')
// var timesheetService = require('./services/timesheetService');
// var service = new timesheetService();
var projectService = require('./services/projectService');
var associateService = require('./services/associateService');
var timesheetService = require('./services/timesheetService');
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})  
router.get('/', function (req, res) {
  res.send('Birds home page')
})
router.post('/updateEmployee', function (req, res) {
  var service = new projectService();
  return service.updateEmployee(req).then((result)=>{res.status(200).send(result)});  
})

router.post('/updateEmployeeManager', function (req, res) {
  var service = new projectService();
  return service.updateEmployeeManager(req).then((result)=>{res.status(200).send(result)});  
})

router.post('/getProjectMappings', function (req, res) {
  var service = new projectService();
  return service.getProjectMappings(req).then((result)=>{res.status(200).send(result.Items[0])});  
})

router.post('/addProject', function (req, res) {
    var service = new projectService();
    return res.send(service.addProject(req));  
})
router.post('/addUser', function (req, res) {
  var service = new projectService();
  return res.send(service.addUser(req));  
})
router.post('/addAssociate', function (req, res) {
  var service = new associateService();
  return res.send(service.addAssociate(req));  
})
router.post('/addTimesheet', function (req, res) {
  var service = new timesheetService();
  return service.addTimesheet(req)
  .then(
    function(result){
      res.send(result);
    })
    .catch(function(err){
      res.send(err);
    });  
})

router.post('/getTimesheet', function (req, res) {
  var service = new timesheetService();
  return service.getTimesheet(req)
    .then((result)=>{res.send(result.Items)})
    .catch((err)=>{res.send(err)});  
})

router.post('/getEmployeeTimesheet', function (req, res) {
  var service = new timesheetService();
  return service.getEmployeeTimesheet(req)
    .then((result)=>{res.send(result.Items)})
    .catch((err)=>{res.send(err)});  
})

router.post('/updateTimesheet', function (req, res) {
  var service = new timesheetService();
  return service.updateTimesheet(req)
  .then(
    function(result){
      res.send(result);
    })
    .catch(function(err){
      res.send(err);
    });  
})


router.post('/getPendingApproval', function (req, res) {
  var service = new timesheetService();
  return service.getPendingApproval(req)
    .then((result)=>{res.send(result.Items)})
    .catch((err)=>{res.send(err)});  
})
module.exports = router