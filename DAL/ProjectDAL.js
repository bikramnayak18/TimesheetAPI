var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

var projectDal = function () {
    this.updateEmployee = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var project = request.body;
        var message = "";
        var params = {
            TableName: "Employee",
            Key: {
                "EmpId": project.EmpId
            },
            UpdateExpression: 'set #info = list_append(if_not_exists(#info, :empty_list), :projectInfo)',
            ExpressionAttributeNames: {
                '#info': 'info'
            },
            ExpressionAttributeValues: {
                ':projectInfo': project.info,
                ':empty_list': []
            },
            ReturnValues: "UPDATED_NEW"
        };
        return new Promise((resolve, reject) => {
            docClient.update(params, function (err, data) {
                if (err) {
                    console.error("Unable to add Project", project.EmpId, ". Error JSON:", JSON.stringify(err, null, 2));
                    message = "error updating project";
                    reject(message);
                } else {
                    console.log("PutItem succeeded:", project.EmpId);
                    message = "project updated";
                    resolve(message);
                }
            });
        });

    }

    this.updateEmployeeManager = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var project = request.body;
        var message = "";
        var params = {
            TableName: "Employee",
            Key: {
                "EmpId": project.EmpId
            },
            UpdateExpression: 'set #managerInfo = list_append(if_not_exists(#managerInfo, :empty_list), :managerInfo)',
            ExpressionAttributeNames: {
                '#managerInfo': 'managerInfo'
            },
            ExpressionAttributeValues: {
                ':managerInfo': project.managerInfo,
                ':empty_list': []
            },
            ReturnValues: "UPDATED_NEW"
        };
        return new Promise((resolve, reject) => {
            docClient.update(params, function (err, data) {
                if (err) {
                    message = "Error updating employee manager";
                    reject(message);
                } else {
                    message = "Updated employee manager";
                    resolve(message);
                }
            });
        });

    }

    this.getProjectMappings = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var project = request.body;
        
        var params = {
            TableName : "Employee",
            KeyConditionExpression: "#EmpId = :val ",
            ExpressionAttributeNames:{
                "#EmpId": "EmpId"
            },
            ExpressionAttributeValues: {
                ":val": project.empId
            }
        };
        return new Promise((resolve,reject)=>{
            docClient.query(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve( data);
                }
            });
        });

    }
    this.addProject = function (request) {
        console.log("adding project...." + request[0]);
        var docClient = new AWS.DynamoDB.DocumentClient();
        console.log("Importing Project into DynamoDB. Please wait.");
        //var allProjects = JSON.parse(fs.readFileSync('./DAL/projectData.json', 'utf8'));
        var allProjects = request.body;
        var message = "";
        allProjects.forEach(function (project) {
            console.log(project.ProjectId);
            var params = {
                TableName: "Project",
                Item: {
                    "ProjectId": project.ProjectId,
                    "StartDate": project.StartDate,
                    "info": project.info
                }
            };
            docClient.put(params, function (err, data) {
                if (err) {
                    console.error("Unable to add Project", project.ProjectId, ". Error JSON:", JSON.stringify(err, null, 2));
                    message = "error adding project";
                } else {
                    console.log("PutItem succeeded:", project.ProjectId);
                    message = "project added";
                }
            });
            return message;
        });
    }
    this.addUser = function (request) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var associates = request.body;
        var message = "";
        associates.forEach(function (associate) {
            var params = {
                TableName: "Authentication",
                Item: {
                    "UserName": associate.UserName,
                    "EmpId": associate.EmpId,
                    "Password": associate.Password
                }
            };
            docClient.put(params, function (err, data) {
                if (err) {
                    console.error("Unable to add associate", associate.UserName, ". Error JSON:", JSON.stringify(err, null, 2));
                    message = "Error creating user";
                } else {
                    console.log("PutItem succeeded:", associate.UserName);
                    message = "User created";
                }
            });
            return message;
        });
    }
}

module.exports = projectDal;