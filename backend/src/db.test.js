
const db = require('./db')


afterEach(async () => {
    await db.clear_db();
});

afterAll(() => {
    db.disconnect_db();
});

test("DB test suite runs", () => {
    expect(1).toBe(1);
});


test("DB can register user", async () => {
    await db.register_user("username", "password");

    expect(await db.count_users()).toBe(1);
});

test("DB can login registered user", async () => {
    await db.register_user("username", "password");

    expect(await db.login_user("username", "password")).toBeTruthy();
});

test("DB incorrect password fails login", async () => {
    await db.register_user("username", "password");

    expect(await db.login_user("username", "not_password")).toBeFalsy();
});

test("DB null password fails login", async () => {
    await db.register_user("username", "password");

    expect(await db.login_user("username", null)).toBeFalsy();
});

test("DB null username fails login", async () => {
    await db.register_user("username", "password");

    expect(await db.login_user(null, "password")).toBeFalsy();
});

test("DB can verify a JWT token", async () => {
    await db.register_user("username", "password");

    const token = await db.login_user("username", "password");

    expect(db.verify_token(token)).toBeTruthy();

    expect(db.verify_token(token).username).toStrictEqual("username");
});

test("DB invalid token is not verified", async () => {
    await db.register_user("username", "password");

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF\ _xSJyQQ";

    expect(db.verify_token(token)).toBeFalsy();
});
