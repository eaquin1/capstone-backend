require("dotenv/config");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const User = require("../models/user");
const redis_client = require("../redis-config")

const jwt = require("jsonwebtoken");

passport.serializeUser(function (user, done) {
    done(null, user.dexcom_id);
});

passport.deserializeUser(function (id, done) {
    User.findOne(id).then((user) => {
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
            callbackURL: "http://localhost:5000/auth/dexcom/redirect",
        },
        (accessToken, refreshToken, profile, done) => {
            let tokenToId = jwt.decode(accessToken);
            let user_id = tokenToId.sub;

            let user = {
                dexcom_id: user_id,
                access_token: accessToken,
                user_refresh_token: refreshToken,
            };
            redis_client.setex(user_id, 100, accessToken);
            
            User.findOne(user).then((existingUser) => {
                if (existingUser) {
                    console.log("current user found", existingUser);
                    done(null, existingUser);
                } else {
                    User.register(user).then((newUser) => {
                        console.log("new user created", newUser);
                        done(null, newUser);
                    });
                }
            });
        }
    )
);


