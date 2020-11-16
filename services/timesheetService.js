var timesheetDAL = require('../DAL/TimesheetDAL');
var TimesheetDAL =new timesheetDAL();
    var timesheetService = function (){
        this.addTimesheet = function(request){
            return TimesheetDAL.addTimesheet(request);
        }
        this.updateTimesheet = function(request){
            return TimesheetDAL.updateTimesheet(request);
        }
        this.getTimesheetByDate = function(request){
            return TimesheetDAL.getTimesheetByDate(request);
        }
        this.getEmployeeTimesheet = function(request){
            return TimesheetDAL.getEmployeeTimesheet(request);
        }
        this.getTimesheet = function(request){
            return TimesheetDAL.getTimesheet(request);
        }

        this.getPendingApproval = function(request){
            return TimesheetDAL.getPendingApproval(request);
        }
    }

module.exports = timesheetService;