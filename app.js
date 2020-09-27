const express = require("express");
const { shouldSendSameSiteNone } = require("should-send-same-site-none");
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

const cookieSession = require("cookie-session");
const frontEnd =
    process.env.NODE_ENV === "production"
        ? process.env.FRONT_END
        : "http://localhost:3000";

//allow front end calls

app.use(shouldSendSameSiteNone);
app.use(
    cors({
        credentials: true,
        origin: frontEnd,
        //allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"],
    })
);

// let ALLOWED_ORIGINS = [
//     frontEnd,
//     "https://developer-portal-dot-g5-dexcom-prod-us-5.appspot.com/",
//     "https://dexcom-tracker.herokuapp.com",
// ];

// app.use((req, res, next) => {
//     let origin = req.headers.origin;
//     let theOrigin =
//         ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
//     console.log("origin", theOrigin);
//     res.header("Access-Control-Allow-Origin", theOrigin);
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );

//     next();
// });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});
app.set("trust proxy", 1);
// app.use(
//     session({
//         genid: (req) => {
//             return uuid(); //use UUIDs for session IDs
//         },
//         store: new redisStore({
//             //host: "localhost",
//             //url: process.env.REDIS_URL,
//             // port: 6480, // 6379,
//             client: redisClient,
//         }),
//         name: "dexcom_user",
//         secret: process.env.SESSION_SECRET,
//         resave: false,
//         maxAge: 2 * 60 * 60 * 1000,
//         cookie: { secure: true, sameSite: "none" },
//         saveUninitialized: false,
//     })
//);
app.use(
    cookieSession({
        name: "dexcom_user",
        secret: process.env.SESSION_SECRET,
        // sameSite: "none",
        // secure: true,
        // httpOnly: true,
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
