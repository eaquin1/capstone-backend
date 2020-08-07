const db = require("../db")

class User {

    static async findOne(data) {
        const find = await db.query(
            `SELECT dexcom_id
            FROM users
            WHERE dexcom_id = $1`, [data.dexcom_id]
        )

        return find.rows[0]
    }
    static async register(data) {
        const duplicateCheck = await db.query(
            `SELECT dexcom_id
            FROM users
            WHERE dexcom_id = $1`, [data.dexcom_id]
        )

        //code runs if duplicate user is trying to be added
        if (duplicateCheck.rows[0]) {
            const error = new Error(
                `User already exists in database`
            );
            error.status = 409;
            throw error;
        }

        //add user to database
        const result = await db.query(
            `INSERT INTO users
            (dexcom_id, user_refresh_token)
            VALUES ($1, $2)
            RETURNING dexcom_id, user_refresh_token
            `, [data.dexcom_id, data.user_refresh_token]
        )
        return result.rows[0]
    }
    
}

module.exports = User