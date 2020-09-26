const express = require("express");
const router = express.Router();
const passport = require("passport");
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
    res.cookie("id", req.sessionID, {
        expires: new Date(Date.now() + 7200 * 1000),
        SameSite: "None",
        secure: true,
    }).redirect(`${frontEnd}/home`);
});

//route to check cookie against req.sessionID
router.get("/user", (req, res, next) => {
    try {
        if (req.isUnauthenticated()) {
            return res.json("Not logged in");
        } else if (req.isAuthenticated()) {
            return res.json(req.sessionID);
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
