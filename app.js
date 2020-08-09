const express = require("express");
const app = express();
const passport = require("passport");
const authRoutes = require("./routes/auth-routes");
const dataRoutes = require("./routes/data-routes");
require("./config/passport-setup");
const session = require("express-session");
const redisClient = require("./config/redis-config");
const redisStore = require("connect-redis")(session);
const { v4: uuid } = require("uuid");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

app.use(
    session({
        genid: (req) => {
            return uuid();
        },
        store: new redisStore({
            host: "localhost",
            port: 6379,
            client: redisClient,
        }),
        name: "_redisDemo",
        secret: process.env.SESSION_SECRET,
        resave: false,
        cookie: { secure: false, maxAge: 120000 }, // Set to secure:false and expire in 2 minutes for demo purposes
        saveUninitialized: true,
    })
);

app.get("/", (req, res, next) => {
    //res.json("Home")
    console.log(res.req);
});
app.use("/dexcom", (req, res) => {
    res.json("Dexcom");
});
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

module.exports = app;
