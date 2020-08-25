const db = require("../db");

const ExpressError = require("../expressError");

class Meal {
    /** GET all meals for a single user: returns {
     *                          meal1: [food1, food2, ...],
     *                          meal2:  [food1, food2, ...],
     *                                ...}
     * */
    static async getAllMealsForUser(dexcom_id) {
        const mealsResponse = await db.query(
            `SELECT id, dexcom_id, foods, carb_count, date
            WHERE id=$1`,
            [dexcom_id]
        );

        const meals = mealsResponse.rows;

        if (!meals) {
            throw new ExpressError(`No such meal: ${id}`, 404);
        }

        return meals;
    }

    /** GET all meals within a certain time frame, for a single user:
     * returns {
     *          meal1: {foodItems: [food1, food2...], carbCount: 12, time: (timestamp)},
     *          meal2: {foodItems: [food1, food2...], carbCount: 12, time: (timestamp)},
     *          ...}    */

    static async getMealsTimeRange(dexcom_id, startTime, endTime) {
        const mealsReponse = await db.query(
            `SELECT id, dexcom_id, foods, carb_count, date
            WHERE id=$1 AND date <=$2 AND date >=$3`,
            [dexcom_id, startTime, endTime]
        );

        const meals = mealsResponse.rows;
        if (!meals) {
            throw new ExpressError(`No such meal: ${id}`, 404);
        }

        return meals;
    }

    /** GET a single meal: returns  [food1, food2, ...] */
    static async getOneMeal(id) {
        const mealResponse = await db.query(
            `SELECT id, dexcom_id, foods, carb_count, date
            WHERE id=$1`,
            [id]
        );

        const meal = mealResponse.rows[0];

        if (!meal) {
            throw new ExpressError(`No such meal: ${id}`, 404);
        }

        return meal;
    }

    /** POST a single meal */
    static async createMeal(data) {
        console.log("creating meal");
        const result = await db.query(
            `INSERT INTO meals
            (name, dexcom_id, foods, carb_count, date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, dexcom_id, name, foods, carb_count, date`,
            [data.name, data.dexcom_id, data.foods, data.carb_count, data.date]
        );
        console.log(result.rows[0]);
        return result.rows[0];
    }

    /** PATCH a single meal  */
    static async patchMeal(data) {
        const result = await db.query(`UPDATE meals SET foods=$1 WHERE id=$2`, [
            data.foods,
            data.id,
        ]);

        const meal = result.rows[0];
        if (!meal) {
            throw new ExpressError(`No meal with id ${data.id}`, 404);
        }

        return meal;
    }

    /** DELETE a single meal */
    static async deleteMeal(id) {
        const result = await db.query(
            `DELETE FROM meals WHERE id=$1 RETURNING id`,
            [id]
        );
        if (results.rows.length === 0) {
            throw new ExpressError(`${id} does not exist`, 404);
        }
    }
}

module.exports = Meal;
