let testUserToken;
let testAdminToken;

beforeEach(async function () {
    const hashedPassword = await bcrypt.hash("secret", BCRYPT_WORK_FACTOR);
    await db.query(`INSERT INTO users VALUES ('test', $1)`, [hashedPassword]);
    await db.query(`INSERT INTO users VALUES ('admin', $1)`, [hashedPassword]);

    // we'll need tokens for future requests
    const testUser = { username: "test" };
    const testAdmin = { username: "admin" };
    testUserToken = jwt.sign(testUser, SECRET_KEY);
    testAdminToken = jwt.sign(testAdmin, SECRET_KEY);
});

describe("GET /secret success", function () {
    test("returns 'Made it'", async function () {
        const response = await request(app)
            .get(`/secret`)
            .send({ _token: testUserToken });
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Made it!" });
    });
});

describe("GET /secret failure", function () {
    test("returns 401 when logged out", async function () {
        const response = await request(app).get(`/secret`); // no token being sent!
        expect(response.statusCode).toBe(401);
    });

    test("returns 401 with invalid token", async function () {
        const response = await request(app)
            .get(`/secret`)
            .send({ _token: "garbage" }); // invalid token!
        expect(response.statusCode).toBe(401);
    });
});
