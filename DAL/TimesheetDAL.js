var AWS = require("aws-sdk");
var fs = require('fs');
const { resolve } = require("path");
const { v4: uuidv4 } = require('uuid');
AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var timesheetDAL = function () {
    this.addTimesheet = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var timesheet = request.body;
        var message = "";
        var params = {
            TableName: "Timesheet",
            Item: {

                "FromDate": timesheet.dates[0],
                "ToDate": timesheet.dates[4],
                "EmpId": timesheet.employee.empId,
                "EmpName": timesheet.employee.employeeName,
                "Status": timesheet.status,
                "ApproverName": timesheet.approver.managerName,
                "approverId": timesheet.approver.managerId,
                "info": timesheet.data
            }
        };
        return new Promise((resolve, reject) => {
            var getPrams = getTimesheetByDate(request);
            docClient.query(getPrams, function (err1, data1) {
                if (err1) {
                    reject(err1);
                } else {
                    if (data1.Count > 0) {
                        var m = { "message": "Timesheet already submitted for this week." };
                        resolve(m);
                    } else {
                        docClient.put(params, function (err, data) {
                            if (err) {
                                message = "Error saving timesheet";
                                reject(err);
                            } else {
                                var m = { "message": "Timesheet Submitted Suceesfully" };
                                resolve(m);
                            }
                        });
                    }
                }
            });
        });
    }
    this.updateTimesheet = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var timesheet = request.body;
        var params = {
            TableName: "Timesheet",
            Key: {
                "EmpId": timesheet.empId,
                "FromDate": timesheet.startDate
            },
            UpdateExpression: "set #Status = :val",
            ExpressionAttributeNames: {
                "#Status": "Status"
            },
            ExpressionAttributeValues: {
                ":val": timesheet.status
            },
            ReturnValues: "UPDATED_NEW"
        };
        return new Promise((resolve, reject) => {
            docClient.update(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    var m = { "message": "Timesheet Updated Suceesfully" };
                    resolve(m);
                }
            });
        });
    }

    var getTimesheetByDate = function (request) {
        var timesheet = request.body;
        var params;

        params = {
            TableName: "Timesheet",
            KeyConditionExpression: "#EmpId = :val and FromDate=:fromDate",
            FilterExpression: "#Status = :submitted or #Status = :approved ",
            ExpressionAttributeNames: {
                "#EmpId": "EmpId",
                "#Status": "Status"
            },
            ExpressionAttributeValues: {
                ":val": timesheet.employee.empId, ":fromDate": timesheet.dates[0], ":submitted": 'Submitted',
                ":approved": 'Approved'
            }
        };

        return params;
    }

    this.getTimesheet = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var timesheet = request.body;
        var params;
        if ( timesheet.startDate)
            params = {
                TableName: "Timesheet",
                KeyConditionExpression: "#EmpId = :val and FromDate=:fromDate",
                FilterExpression: "#Status= :status",
                ExpressionAttributeNames: {
                    "#EmpId": "EmpId",
                    "#Status": "Status"
                },
                ExpressionAttributeValues: {
                    ":val": timesheet.empId, ":status": timesheet.status, ":fromDate": timesheet.startDate
                }
            };
        else if (!timesheet.approverId)
            params = {
                TableName: "Timesheet",
                KeyConditionExpression: "#EmpId = :val",
                FilterExpression: "#Status= :status",
                ExpressionAttributeNames: {
                    "#EmpId": "EmpId",
                    "#Status": "Status"
                },
                ExpressionAttributeValues: {
                    ":val": timesheet.empId, ":status": timesheet.status
                }
            };
        else
            params = {
                TableName: "Timesheet",
                KeyConditionExpression: "#EmpId = :val and FromDate=:fromDate",
                FilterExpression: "#Status= :status and approverId= :approverId",
                ExpressionAttributeNames: {
                    "#EmpId": "EmpId",
                    "#Status": "Status"
                },
                ExpressionAttributeValues: {
                    ":val": timesheet.empId, ":status": timesheet.status, ":approverId": timesheet.approverId, ":fromDate": timesheet.startDate
                }
            };
        return new Promise((resolve, reject) => {
            if (!timesheet || !timesheet.empId)
                return reject({ "message": "employee id not specified" });
            docClient.query(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    this.getPendingApproval = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var timesheet = request.body;
        var message = "";

        var params;
        if (timesheet.approverId)
            params = {
                TableName: "Timesheet",
                FilterExpression: "#Status= :status and #approverId=:approverId",
                ExpressionAttributeNames: {
                    "#approverId": "approverId",
                    "#Status": "Status"
                },
                ExpressionAttributeValues: {
                    ":approverId": timesheet.approverId, ":status": timesheet.status
                }
            };


        return new Promise((resolve, reject) => {
            docClient.scan(params, function (err, data) {
                if (!timesheet.approverId)
                    reject({ "message": "approver id not specified" });
                else if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    this.getEmployeeTimesheet = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var timesheet = request.body;
        var message = "";
        var params;
        params = {
            TableName: "Timesheet",
            KeyConditionExpression: "EmpId = " + timesheet.empId,
        };

        return new Promise((resolve, reject) => {
            docClient.scan(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = timesheetDAL;