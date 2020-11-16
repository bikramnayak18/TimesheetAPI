var projectDal = require('../DAL/ProjectDAL');
var DALService =new projectDal();
    var projectService = function (){
        this.updateEmployee = function(request){
            return DALService.updateEmployee(request);
        }
        this.updateEmployeeManager = function(request){
            return DALService.updateEmployeeManager(request);
        }
        this.getProjectMappings = function(request){
            return DALService.getProjectMappings(request);
        }
        this.addProject = function(request){
            return DALService.addProject(request);
        }

        this.addUser = function(request){
            return DALService.addUser(request);
        }
    }

module.exports = projectService;