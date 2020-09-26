const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const dataRoutes = require("./routes/data-routes");
require("./config/passport-setup");
const session = require("express-session");
const redisClient = require("./config/redis-config");
const redisStore = require("connect-redis")(session);
const { v4: uuid } = require("uuid");
const ExpressError = require("./expressError");
//const { shouldSendSameSiteNone } = require("should-send-same-site-none");
const frontEnd =
    process.env.NODE_ENV === "production"
        ? process.env.FRONT_END
        : "http://localhost:3000";

//allow front end calls
console.log("Front end", frontEnd);
app.use(
    cors({
        credentials: true,
        origin: "https://dexcom-tracker.herokuapp.com",
        //allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(shouldSendSameSiteNone);
//app.set("trust proxy", 1);
redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

app.use(
    session({
        genid: (req) => {
            return uuid(); //use UUIDs for session IDs
        },
        store: new redisStore({
            //host: "localhost",
            //url: process.env.REDIS_URL,
            // port: 6480, // 6379,
            client: redisClient,
        }),
        name: "dexcom_user",
        secret: process.env.SESSION_SECRET,
        //proxy: true,
        resave: false,
        maxAge: 2 * 60 * 60 * 1000,
        cookie: { secure: true, sameSite: "none" },
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);

    // pass the error to the next piece of middleware
    return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    console.log("printing error");
    console.log("***************************");
    return res.json({
        status: err.status,
        message: err.message,
    });
});

module.exports = app;
