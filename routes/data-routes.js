const express = require("express");
const router = express.Router();
require("dotenv/config");
const axios = require("axios");
const Meal = require("../models/meal");
const BASE_URL_DEX = "https://sandbox-api.dexcom.com/v2/users/self";
const BASE_URL_EDAMAM = "https://api.edamam.com/api/food-database/v2";
const ED_APP_ID = process.env.ED_APP_ID;
const ED_APP_KEY = process.env.ED_APP_KEY;

//GET estimated glucose values from Dexcom API
router.get("/egvs", async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        let response = await axios.get(
            `${BASE_URL_DEX}/egvs?startDate=${startDate}&endDate=${endDate}`,
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

// GET events from Dexcom API
router.get("/events", async (req, res) => {
    try {
        let response = await axios.get(
            `${BASE_URL_DEX}/events?startDate=2020-05-25T15:30:00&endDate=2020-05-25T18:45:00`,
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
        let response = await axios.get(`${BASE_URL_DEX}/dataRange`, {
            headers: {
                authorization: `Bearer ${req.session.passport.user.access_token}`,
            },
        });

        return res.json(response.data.egvs);
    } catch (error) {
        console.log(error);
    }
});
// GET carbs with Edamam
router.get("/foods", async (req, res) => {
    //todo: get the food item, weight(?) from user
    //if (req.session.passport.user.access_token){
    //if (req.session) {
    const { food } = req.query;

    try {
        let response = await axios.get(
            `${BASE_URL_EDAMAM}/parser?ingr=${encodeURI(
                food
            )}&app_id=${ED_APP_ID}&app_key=${ED_APP_KEY}`
        );

        return res.json(response.data);
    } catch (error) {
        console.log(error);
    }
});

router.post("/carbs", async (req, res) => {
    const { quantity, measureURI, foodId } = req.body.data.item;

    try {
        let response = await axios.post(
            `${BASE_URL_EDAMAM}/nutrients?&app_id=${ED_APP_ID}&app_key=${ED_APP_KEY}`,
            {
                ingredients: [
                    {
                        quantity: +quantity,
                        measureURI: measureURI,
                        foodId: foodId,
                    },
                ],
            }
        );

        return res.json(response.data);
    } catch (error) {
        console.log(error);
    }
});

router.post("/addmeal", async (req, res) => {
    const { mealData } = req.body;
    console.log("userId", req.session);
    console.log("meal", req.body);
    const meal = {
        dexcom_id: req.session.passsport.user.dexcom_id,
        foods: mealData.foods,
        carb_count: mealData.meal.carbCount,
    };
    try {
        // data = {
        //     dexcom_id: `59`,
        //     foods: ["ice cream", "chocolate", "cone"],
        //     carb_count: 33,
        // };
        const response = await Meal.createMeal(meal);
        return res.status(201).json({ meal });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
