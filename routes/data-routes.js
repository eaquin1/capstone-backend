const express = require("express");
const router = express.Router();
require("dotenv/config");
const axios = require("axios")
const BASE_URL = 'https://sandbox-api.dexcom.com/v2/users/self'
const ED_APP_ID = process.env.ED_APP_ID;
const ED_APP_KEY = process.env.ED_APP_KEY;

//GET estimated glucose values from Dexcom API
router.get('/egvs', (req, res) =>{
    //todo: get the start dates and times from the user
    axios.get(`${BASE_URL}/egvs?startDate=2020-05-25T15:30:00&endDate=2020-05-25T15:45:00`, {
        headers: {
          "authorization": `Bearer ${req.session.passport.user.access_token}`
        }
      })
      .then(function (response) {
        console.log(response.data);
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      });
})

// GET events from Dexcom API
router.get('/events', (req, res) => {
    axios.get(`${BASE_URL}/events?startDate=2020-05-25T15:30:00&endDate=2020-05-25T18:45:00`, {
        headers: {
          "authorization": `Bearer ${req.session.passport.user.access_token}`
        }
      })
      .then(function (response) {
        console.log(response.data);
        return response.data
      })
      .catch(function (error) {
        console.log(error);
      });
    
});

// GET carbs with Edamam
router.get('/carbs', (req, res) => {
    //todo: get the food item, weight(?) from user
    if (req.session.passport.user.access_token){
    axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=red%20apple&app_id=${ED_APP_ID}&app_key=${ED_APP_KEY}`)
      .then(function (response) {
        console.log(response.data);
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
});



module.exports = router;