var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "us-east-1",
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"});

var associateDAL  = function(){
    this.addAssociate=function(request){
        var docClient = new AWS.DynamoDB.DocumentClient();
        var associates = request.body;
        var message = "";
        associates.forEach(function(associate) {
            var params = {
                TableName: "Associates",
                Item: {
                    "ManagerId":  associate.ManagerId,
                    "EmpId": associate.EmpId
                }
            };
            docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add associate", associate.EmpId, ". Error JSON:", JSON.stringify(err, null, 2));
                message = "error adding associate";
            } else {
                console.log("PutItem succeeded:", associate.EmpId);
                message = "associate added";
            }
            });
            return message;
        });
    }
}

module.exports = associateDAL;