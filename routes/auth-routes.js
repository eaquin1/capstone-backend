const e = require("express");
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
router.get(
    "/dexcom/redirect",
    passport.authenticate("oauth2"),
    async (req, res) => {
        try {
            console.log("req.session", req.session);
            req.session.save(() => {
                res.redirect(`${frontEnd}/home`);
            });
        } catch (error) {
            next(error);
        }
    }
);

//route to check cookie against req.sessionID
router.get("/user", (req, res, next) => {
    console.log("req.session.passport.user, inside auth check", req.session);
    console.log("Authenticated?, inside auth check", req.isAuthenticated());
    try {
        if (req.isAuthenticated()) {
            const token = createToken(req.session.passport.user);
            return res.json({ token });
        } else {
            return res.json(null);
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
