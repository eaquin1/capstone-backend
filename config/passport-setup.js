require("dotenv/config");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const BASE_URL =
    process.env.NODE_ENV === "production"
        ? process.env.BASE_URL
        : "http://localhost:5000";

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    console.log("deserialize id", id);
    User.findOne(id.dexcom_id).then((user) => {
        console.log("deserialize user", user);

        done(null, user);
    });
});

passport.use(
    new OAuth2Strategy(
        {
            // options for Dexcom strategy
            clientID: clientID,
            authorizationURL: `https://sandbox-api.dexcom.com/v2/oauth2/login`,
            tokenURL: "https://sandbox-api.dexcom.com/v2/oauth2/token",
            clientSecret: clientSecret,
            callbackURL: `${BASE_URL}/auth/dexcom/redirect`,
        },
        (accessToken, refreshToken, profile, done) => {
            let tokenToId = jwt.decode(accessToken);
            let user_id = tokenToId.sub;

            let user = {
                dexcom_id: user_id,
                access_token: accessToken,
                user_refresh_token: refreshToken,
            };

            User.findOne(user).then((existingUser) => {
                if (existingUser) {
                    console.log("current user found", existingUser);

                    done(null, user);
                } else {
                    User.register(user).then((newUser) => {
                        console.log("new user created", newUser);
                        done(null, user);
                    });
                }
            });
        }
    )
);
