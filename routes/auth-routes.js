require("dotenv/config");

const express = require("express");
const router = express.Router();
const passport = require("passport")
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;


//auth login
router.get('/login', (req, res) =>{
    res.render('login', { user: req.user });

})

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with Dexcom
router.get('/dexcom', passport.authenticate('oauth2', {
    scope: [
    'egv',
    'calibrations',
    'devices',
    'dataRange',
    'events',
    'statistics'], 
    session: true
}));

// callback route for dexcom to redirect to
router.get('/dexcom/redirect', passport.authenticate('oauth2'), (req, res) => {
    res.send('you reached the redirect URI');
});

module.exports = router;