const cors = require("cors");
const express = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { success, error } = require("consola");
const db = require('./config/db');
db.connect();
const { PORT } = require("./config")
const app = express();
// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());
require("./middlewares/passport")(passport);
// User Router Middleware
app.use("/api/users", require("./routes/users"));
app.listen(PORT,()=> success({message:`server start on port ${PORT}`}))