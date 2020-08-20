const express = require("express");
const router = express.Router();
require("dotenv/config");
const axios = require("axios");
const Meal = require("../models/meal");
const BASE_URL = "https://sandbox-api.dexcom.com/v2/users/self";
const ED_APP_ID = process.env.ED_APP_ID;
const ED_APP_KEY = process.env.ED_APP_KEY;

//GET estimated glucose values from Dexcom API
router.get("/egvs/:startDate&:endDate", async (req, res) => {
    const { startDate, endDate } = req.params;

    try {
        let response = await axios.get(
            `${BASE_URL}/egvs?startDate=${startDate}&endDate=${endDate}`,
            {
                headers: {
                    authorization: `Bearer ${req.session.passport.user.access_token}`,
                },
            }
        );
        //console.log(response.data);
        return res.json(response.data);
    } catch (error) {
        console.log(error);
    }
});

// GET events from Dexcom API
router.get("/events", async (req, res) => {
    try {
        let response = await axios.get(
            `${BASE_URL}/events?startDate=2020-05-25T15:30:00&endDate=2020-05-25T18:45:00`,
            {
                headers: {
                    authorization: `Bearer ${req.session.passport.user.access_token}`,
                },
            }
        );

        return res.json(response.data);
    } catch (error) {
        console.log(error);
    }
});

//GET data range for a user's account
router.get("/range", async (req, res) => {
    try {
        let response = await axios.get(`${BASE_URL}/dataRange`, {
            headers: {
                authorization: `Bearer ${req.session.passport.user.access_token}`,
            },
        });
        console.log("range", response.data.egvs);
        return res.json(response.data.egvs);
    } catch (error) {
        console.log(error);
    }
});
// GET carbs with Edamam
router.get("/carbs", async (req, res) => {
    //todo: get the food item, weight(?) from user
    //if (req.session.passport.user.access_token){
    //if (req.session) {
    try {
        axios.get(
            `https://api.edamam.com/api/food-database/v2/parser?ingr=red%20apple&app_id=${ED_APP_ID}&app_key=${ED_APP_KEY}`
        );

        return res.json(response.data);
    } catch (error) {
        console.log(error);
    }
});

router.post("/addmeal", async (req, res) => {
    try {
        data = {
            dexcom_id: `59`,
            foods: ["ice cream", "chocolate", "cone"],
            carb_count: 33,
        };
        const meal = await Meal.createMeal(data);
        return res.status(201).json({ meal });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
