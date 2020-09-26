//npm packages
const request = require("supertest");
const MockStrategy = require("passport-mock-strategy");
// app imports
const app = require("../../app");
const db = require("../../db");
const passport = require("passport");

// global auth variable to store things for all the tests
const TEST_DATA = {};

async function beforeEachHook(TEST_DATA) {
    try {
        //login a user
        passport.use(new MockStrategy());
    } catch (error) {
        console.error(error);
    }
}

async function afterEachHook() {
    try {
        await db.query("DELETE FROM meals");
        await db.query("DELETE FROM users");
    } catch (error) {
        console.error(error);
    }
}

async function afterAllHook() {
    try {
        await db.end();
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    afterAllHook,
    afterEachHook,
    TEST_DATA,
    beforeEachHook,
};
