const Express = require("express");
const BodyParser = require("body-parser");
var router  = Express.Router();
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var routes = require('./routes')
console.log("node js listening");
app.listen(5000, () => {
    app.get("/test", (request, response) => {
        response.send("hi from test api");
    });
    app.use('/api/timesheet', routes);
});