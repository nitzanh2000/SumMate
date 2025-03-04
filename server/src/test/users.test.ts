import appPromise from "../app";
import mongoose from "mongoose";
import request from "supertest";
import { UserModel } from "../models/user_model";
import {
  generateAccessToken,
} from "../utils/auth/generate_access_token";
import {
  afterEach,
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";
import { convertUserToJwtInfo } from "../utils/auth/auth";

const authUser = {
  username: "auth",
  password: "auth",
  email: "auth@auth.auth",
};

const user = { username: "test", password: "test", email: "test@test.test" };

const users = [
  {
    ...user,
  },
  {
    ...user,
    username: "test2",
  },
];

const headers = { authorization: "" };

request.h;

beforeAll(async () => {
  await appPromise;
  await UserModel.create(authUser);
  headers.authorization =
    "Bearer " +
    generateAccessToken(
      convertUserToJwtInfo(await UserModel.findOne({ email: authUser.email })),
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRATION
    );
});

afterAll(async () => {
  await UserModel.deleteMany({ email: { $in: [user.email, authUser.email] } });
  await mongoose.connection.close();
});

afterEach(async () => {
  await UserModel.deleteMany({ email: user.email });
});

describe("Users", () => {

  test("Get Me", async () => {
    const res = await request(await appPromise, { headers }).get("/users/me").set(headers);
    expect(res.statusCode).toEqual(200);
    const { email, username } = res.body;
    expect({ email, username }).toEqual({
      email: authUser.email,
      username: authUser.username,
    });
  });

});
