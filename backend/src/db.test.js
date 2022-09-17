
const db = require('./db')

test("DB test suite runs", () => {
    expect(1).toBe(1);
});


test("DB can register user", () => {
    db.register_user("username", "password");

    expect(db.count_users()).toBe(1);
});

test("DB can login registered user", () => {
    db.register_user("username", "password");

    expect(db.login_user("username", "password")).toBeTruthy();
});

test("DB incorrect password fails login", () => {
    db.register_user("username", "password");

    expect(db.login_user("username", "not_password")).toBeFalsy();
});

test("DB can verify a JWT token", () => {
    db.register_user("username", "password");

    const token = db.login_user("username", "password");

    expect(db.verify_token(token)).toBeTruthy();

    expect(db.verify_token(token).username).toStrictEqual("username");
});

test("DB invalid token is not verified", () => {
    db.register_user("username", "password");

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF\ _xSJyQQ";

    expect(db.verify_token(token)).toBeFalsy();
});
