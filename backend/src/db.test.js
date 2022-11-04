
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

describe("User DB", () => {
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

    expect(await db.verify_token(token)).toBeTruthy();

    expect((await db.verify_token(token)).username).toStrictEqual("username");
  });

  test("DB invalid token is not verified", async () => {
    await db.register_user("username", "password");

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.cThIIoDvwdueQB468K5xDc5633seEFoqwxjF\ _xSJyQQ";

    expect(await db.verify_token(token)).toBeFalsy();
  });
})

describe("WASM actions DB", () => {
  beforeAll(async () => {
    await db.register_user("user", "password");
  });

  test("DB WASM action can be created", async () => {
    await db.create_action("user", "hello-cgi.wasm", {});

    const created_actions = await db.get_all_actions("user");

    expect((await created_actions.toArray()).length).toEqual(1);
  })

  test("DB action document contains an ID", async () => {
    await db.create_action("user", "hello-cgi.wasm", {});

    const created_actions = await db.get_all_actions("user");

    created_actions.forEach(action => {
      expect(action._id).toBeTruthy();
    });
  })

  test("DB action can be fetched by ID", async () => {
    const created_action = await db.create_action("user", "hello-cgi.wasm", {});

    const same_action = await db.get_action(created_action.insertedId);

    expect(same_action).toStrictEqual({
      _id: created_action.insertedId,
      filename: "hello-cgi.wasm",
      owner: "user",
      params: {}
    });
  })

  test("DB action can be updated", async () => {
    const created_action = await db.create_action("user", "hello-cgi.wasm", {});

    const same_action = await db.get_action(created_action.insertedId);

    same_action.params = { fsPaths: ["/tmp"]};

    await db.update_action(same_action);

    const updated_action = await db.get_action(same_action._id);

    expect(updated_action).toStrictEqual(same_action);
  })

  test("DB action can be deleted", async () => {
    const created_action = await db.create_action("user", "hello-cgi.wasm", {});

    await db.delete_action(created_action.insertedId);

    const actions = await db.get_all_actions("user");

    expect((await actions.toArray()).length).toEqual(0);
  })
})
