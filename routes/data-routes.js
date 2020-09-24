const express = require("express");
const router = express.Router();
require("dotenv/config");
const axios = require("axios");
const Meal = require("../models/meal");
const BASE_URL_DEX = "https://sandbox-api.dexcom.com/v2/users/self";
const BASE_URL_EDAMAM = "https://api.edamam.com/api/food-database/v2";
const ED_APP_ID = process.env.ED_APP_ID;
const ED_APP_KEY = process.env.ED_APP_KEY;
const authRequired = require("../middleware/auth");

//GET estimated glucose values from Dexcom API
router.get("/egvs", authRequired, async (req, res, next) => {
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
        next(error);
    }
});

// GET events from Dexcom API
router.get("/events", authRequired, async (req, res, next) => {
    try {
        console.log(req.session);
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
        next(error);
    }
});

//GET data range for a user's account
router.get("/range", authRequired, async (req, res, next) => {
    try {
        let response = await axios.get(`${BASE_URL_DEX}/dataRange`, {
            headers: {
                authorization: `Bearer ${req.session.passport.user.access_token}`,
            },
        });

        return res.json(response.data.egvs);
    } catch (error) {
        next(error);
    }
});

// GET food data from Edaman
router.get("/foods", authRequired, async (req, res, next) => {
    const { food } = req.query;

    try {
        let response = await axios.get(
            `${BASE_URL_EDAMAM}/parser?ingr=${encodeURI(
                food
            )}&app_id=${ED_APP_ID}&app_key=${ED_APP_KEY}`
        );

        return res.json(response.data);
    } catch (error) {
        next(error);
    }
});

//retrieve the carb data from Edaman
router.post("/carbs", authRequired, async (req, res, next) => {
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
        next(error);
    }
});

//Add a meal
router.post("/addmeal", authRequired, async (req, res, next) => {
    const mealData = req.body.data;

    const meal = {
        dexcom_id: req.session.passport.user.dexcom_id,
        name: mealData.meal.name,
        foods: mealData.meal.foods,
        carb_count: mealData.meal.carb_count,
        date: mealData.meal.date,
    };
    console.log("meal received at backend", meal);
    try {
        const response = await Meal.createMeal(meal);
        return res.status(201).json({ meal });
    } catch (error) {
        next(error);
    }
});

//get meals within a time range
router.get("/mealsbytime", authRequired, async (req, res, next) => {
    const { startDate, endDate } = req.query;
    const dexcomId = req.session.passport.user.dexcom_id;

    try {
        const response = await Meal.getMealsTimeRange(
            dexcomId,
            startDate,
            endDate
        );

        console.log("Mealsbytime response", response);
        return res.json(response);
    } catch (error) {
        next(error);
    }
});

//Delete a meal for a user
router.delete("/deletemeal/:id", authRequired, async (req, res, next) => {
    const { id } = req.params;

    try {
        await Meal.deleteMeal(id);
        return res.json({ message: "Meal deleted" });
    } catch (error) {
        next(error);
    }
});

//get all meals for a user
router.get("/mealsbyuser", authRequired, async (req, res, next) => {
    const dexcomId = req.session.passport.user.dexcom_id;

    try {
        const response = await Meal.getAllMealsForUser(dexcomId);

        console.log("All meals response", response);
        return res.json(response);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
