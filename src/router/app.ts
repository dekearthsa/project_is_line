const express = require("express");
const bodyParser = require('body-parser')
const cors = require("cors");
const { controllerDebug } = require("../controller/controllerDebug");
const { controllerLine } = require("../controller/controllerLine");

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors(
    { origin: '*' }
));

app.get("/api/debug", controllerDebug);
app.post("/api/line", controllerLine);

export {app}


