// npm packages
const request = require("supertest");

// app imports
const app = require("../../app");

const {
    TEST_DATA,
    afterEachHook,
    beforeEachHook,
    afterAllHook,
} = require("./config");

beforeEach(async () => {
    await beforeEachHook(TEST_DATA);
});

describe("GET /data/mealsbyuser", async function () {
    test("Gets all meals for a user", async function () {
        const response = await request(app).get(`/data/mealsbyuser`);
    });
});

afterEach(async function () {
    await afterEachHook();
});

afterAll(async function () {
    await afterAllHook();
});
