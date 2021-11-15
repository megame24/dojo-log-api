import User from "./user";
import { MockSecurityService, MockUUIDService } from "../testUtils";

const validCreateUserProps = {
  name: "Mr. crabs",
  email: "test@test.com",
  username: "test124",
  password: "P@ssw0rd",
  role: "USER",
  isPasswordHashed: false,
  isPasswordRequired: true,
};

const createUser = (createUserProps: any) => {
  return User.create(
    createUserProps,
    new MockSecurityService(),
    new MockUUIDService()
  );
};

describe("Creating a user entity", () => {
  it("Should throw an error if name is not provided", async () => {
    const invalidCreateUserProps = { ...validCreateUserProps, name: "" };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual("Name is required");
    expect(user).toBeUndefined();
  });
  it("Should throw an error if name doesn't have a length greater than 1 and less than 255", async () => {
    const invalidCreateUserProps1 = { ...validCreateUserProps, name: "a" };
    let user1;
    let error1;

    try {
      user1 = await createUser(invalidCreateUserProps1);
    } catch (err: any) {
      error1 = err;
    }

    expect(error1.message).toEqual(
      "Name length must be greater than 1 and less than 255"
    );
    expect(user1).toBeUndefined();

    const invalidCreateUserProps2 = {
      ...validCreateUserProps,
      name:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    };
    let user2;
    let error2;

    try {
      user2 = await createUser(invalidCreateUserProps2);
    } catch (err: any) {
      error2 = err;
    }

    expect(error2.message).toEqual(
      "Name length must be greater than 1 and less than 255"
    );
    expect(user2).toBeUndefined();
  });
  it("Should throw an error if email is not provided", async () => {
    const invalidCreateUserProps = { ...validCreateUserProps, email: "" };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual("Email is required");
    expect(user).toBeUndefined();
  });
  it("Should throw an error if email is invalid", async () => {
    const invalidCreateUserProps = {
      ...validCreateUserProps,
      email: "invalid@email",
    };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual("Invalid email");
    expect(user).toBeUndefined();
  });
  it("Should throw an error if username is not provided", async () => {
    const invalidCreateUserProps = { ...validCreateUserProps, username: "" };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual("Username is required");
    expect(user).toBeUndefined();
  });
  it("Should throw an error if username doesn't have a length greater than 1 and less than 255", async () => {
    const invalidCreateUserProps1 = { ...validCreateUserProps, username: "a" };
    let user1;
    let error1;

    try {
      user1 = await createUser(invalidCreateUserProps1);
    } catch (err: any) {
      error1 = err;
    }

    expect(error1.message).toEqual(
      "Username length must be greater than 1 and less than 255"
    );
    expect(user1).toBeUndefined();

    const invalidCreateUserProps2 = {
      ...validCreateUserProps,
      username:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    };
    let user2;
    let error2;

    try {
      user2 = await createUser(invalidCreateUserProps2);
    } catch (err: any) {
      error2 = err;
    }

    expect(error2.message).toEqual(
      "Username length must be greater than 1 and less than 255"
    );
    expect(user2).toBeUndefined();
  });
  it("Should throw an error if password is not provided", async () => {
    const invalidCreateUserProps = { ...validCreateUserProps, password: "" };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual("Password is required");
    expect(user).toBeUndefined();
  });
  it("Should throw an error if password is not provided", async () => {
    const invalidCreateUserProps = {
      ...validCreateUserProps,
      password: "password1",
    };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual(
      "Your password must be greater than 8 characters and must " +
        "contain at least one uppercase letter, one lowercase letter, one number, and a special character"
    );
    expect(user).toBeUndefined();
  });
  it("Should throw an error if an invalid role is provided", async () => {
    const invalidCreateUserProps = {
      ...validCreateUserProps,
      role: "SUPER AWESOME USER",
    };
    let user;
    let error;

    try {
      user = await createUser(invalidCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(error.message).toEqual("Invalid role");
    expect(user).toBeUndefined();
  });
  it("Should create the user successfully when all checks pass", async () => {
    let user: any;
    let error;

    try {
      user = await createUser(validCreateUserProps);
    } catch (err: any) {
      error = err;
    }

    expect(user.id).toEqual("this_is_a_random_uuid");
    expect(user.name).toEqual(validCreateUserProps.name);
    expect(user.email).toEqual(validCreateUserProps.email);
    expect(user.password).toEqual("hashed-password");
    expect(user.username).toEqual(validCreateUserProps.username);
    expect(user.role).toEqual("USER");
    expect(user.verified).toEqual(false);
    expect(error).toBeUndefined();
  });
  it("Password should be optional when creating a user", async () => {
    let user: any;
    let error;

    try {
      user = await User.create(
        {
          name: validCreateUserProps.name,
          username: validCreateUserProps.username,
          email: validCreateUserProps.email,
          isPasswordHashed: false,
          isPasswordRequired: false,
        },
        new MockSecurityService(),
        new MockUUIDService()
      );
    } catch (err: any) {
      error = err;
    }

    expect(user.id).toEqual("this_is_a_random_uuid");
    expect(user.name).toEqual(validCreateUserProps.name);
    expect(user.email).toEqual(validCreateUserProps.email);
    expect(user.username).toEqual(validCreateUserProps.username);
    expect(user.role).toEqual("USER");
    expect(user.verified).toEqual(false);
    expect(error).toBeUndefined();
  });
});
