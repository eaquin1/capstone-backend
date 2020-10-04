const express = require("express");
const { shouldSendSameSiteNone } = require("should-send-same-site-none");
const helmet = require("helmet");
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

const frontEnd =
    process.env.NODE_ENV === "production"
        ? process.env.FRONT_END
        : "http://localhost:3000";

app.use(function (req, res, next) {
    if (req.header("x-forwarded-proto") !== "https") {
        console.log("redirecting to secure");
        res.redirect("https://" + req.header("host") + req.url);
    } else {
        next();
    }
});

app.use(shouldSendSameSiteNone);
//allow front end calls
app.use(
    cors({
        credentials: true,
        origin: frontEnd,
        //allowedHeaders: ["Content-Type", "Authorization"],

        methods: ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"],
    })
);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

app.set("trust proxy", 1);
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
    session({
        genid: (req) => {
            return uuid(); //use UUIDs for session IDs
        },
        store: new redisStore({
            client: redisClient,
        }),
        //proxy: true,
        name: "dexcom_user",
        secret: process.env.SESSION_SECRET,
        resave: false,

        cookie: {
            secure: true,
            sameSite: "none",
            httpOnly: true,
            expires: expiryDate,
            domain: ".t1d-sugar-tracker.herokuapp.com",
        },
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
