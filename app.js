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

//allow front end calls

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

app.use(
    session({
        genid: (req) => {
            return uuid(); //use UUIDs for session IDs
        },
        store: new redisStore({
            host: "localhost",
            port: 6379,
            client: redisClient,
        }),
        name: "_redisDemo",
        secret: process.env.SESSION_SECRET,
        resave: false,
        maxAge: 2 * 60 * 60 * 1000,
        cookie: { secure: false }, // Set to secure:false for demo purposes
        saveUninitialized: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

module.exports = app;
