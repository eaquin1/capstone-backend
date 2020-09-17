const express = require("express");
const router = express.Router();
const passport = require("passport");
const createToken = require("../helpers/createToken");
// //auth login
// router.get("/login", (req, res) => {
//     res.render("login", { user: req.user });
// });

// // auth logout
// router.get("/logout", (req, res) => {
//     // handle with passport
//     res.send("logging out");
// });

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
    //res.send(req.user);
    // console.log("Inside redirect", req.sessionID);
    //const token = createToken(req.sessionID);
    // console.log("jwt", token);
    // res.send(token);
    // res.cookie("id", req.sessionID, {
    //     expires: new Date(Date.now() + 7200),
    // })
    res.redirect("http://localhost:3000/home");
});

module.exports = router;
