require("dotenv/config");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const User = require("../models/user");
const redisClient = require("../config/redis-config");
const jwt = require("jsonwebtoken");

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    // console.log("deser id", id);
    // const user = redisClient.get(`sess:${id}`, function (err, vals) {
    //     if (err) {
    //         throw err;
    //     } else {
    //         console.log("loginInfo", JSON.parse(vals));
    //     }
    // });
    done(null, id);

    // try {
    //     User.findOne(id).then((user) => {
    //         done(null, user);
    //     });
    // } catch (e) {
    //     throw Error(e);
    // }
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
