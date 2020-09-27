const express = require("express");
const router = express.Router();
const passport = require("passport");
const createToken = require("../helpers/createToken");
const frontEnd =
    process.env.NODE_ENV === "production"
        ? process.env.FRONT_END
        : "http://localhost:3000";

// auth with Dexcom
router.get(
    "/dexcom",
    passport.authenticate("oauth2", {
        scope: [
            "egv",
            "calibrations",
            "devices",
            "dataRange",
            "events",
            "statistics",
        ],
        session: true,
    })
);

// callback route for dexcom to redirect to
router.get("/dexcom/redirect", passport.authenticate("oauth2"), (req, res) => {
    // res.cookie("id", req.sessionID, {
    //     expires: new Date(Date.now() + 7200 * 1000),
    //     sameSite: "none",
    //     secure: true,
    // }).
    //console.log("user", req.session.passport.user);
    // const token = createToken(req.session.passport.user);
    return res.redirect(`${frontEnd}/home`);
});

//route to check cookie against req.sessionID
router.get("/user", (req, res, next) => {
    console.log(req.isAuthenticated());
    try {
        if (req.isUnauthenticated()) {
            return res.json(null);
        } else if (req.isAuthenticated()) {
            const token = createToken(req.session.passport.user);
            return res.json({ token });
        }
    } catch (error) {
        next(error);
    }
});

router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy((err) => {
        res.send("Logged Out");
    });
});

module.exports = router;
