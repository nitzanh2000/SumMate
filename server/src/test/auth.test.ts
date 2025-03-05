import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import appPromise from "../app";
import mongoose from "mongoose";
import request from "supertest";
import { afterEach, afterAll, describe, expect, test } from "@jest/globals";
import FormData from "form-data";
import { UserModel } from "../models/user_model";
import { User } from "../dtos/user";
import { generateRefreshToken } from "../utils/auth/generate_refresh_token";
import { convertUserToJwtInfo } from "../utils/auth/auth";

const user = {
  username: "auth",
  password: "auth",
  email: "auth@auth.auth",
};

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await UserModel.deleteMany({ email: user.email });
});

describe("Auth", () => {
  test("Register Successfully", async () => {
    const form = new FormData();
    form.append("user", JSON.stringify(user));

    const res = await request(await appPromise)
      .post("/auth/register")
      .set(
        "Content-Type",
        `multipart/form-data; boundary=${form.getBoundary()}`
      )
      .send(form.getBuffer());

    expect(res.statusCode).toEqual(200);

    const { email, username, password }: User = await UserModel.findOne({
      email: user.email,
    });
    expect({ ...user, password: undefined }).toEqual({
      email,
      username,
    });

    const passwordsMatch = await bcrypt.compare(user.password, password);
    expect(passwordsMatch).toBe(true);
  });

  test("Register Failed, User Already Exists", async () => {
    await UserModel.create(user);

    const res = await request(await appPromise)
      .post("/auth/register")
      .send(user);

    expect(res.statusCode).toEqual(500);
  });

  test("Login Successfully", async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);

    await UserModel.create({ ...user, password: hashedPassword });

    const res = await request(await appPromise)
      .post("/auth/login")
      .send({ username: user.username, password: user.password });

    expect(res.statusCode).toEqual(200);

    const DbUser = await UserModel.findOne({ email: user.email });
  });

  test("Login Failed User Doesn't Exist", async () => {
    const res = await request(await appPromise)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    expect(res.statusCode).toEqual(500);
  });
});

describe("Auth - Logout", () => {
  let refreshToken;

  beforeAll(async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await UserModel.create({
      ...user,
      password: hashedPassword,
    });

    refreshToken = generateRefreshToken(
      convertUserToJwtInfo(newUser),
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRATION
    );

    newUser.tokens = [refreshToken];
    await newUser.save();
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: user.email });
  });

  test("Logout Successfully", async () => {
    const res = await request(await appPromise)
      .post("/auth/logout")
      .set("Authorization", "Bearer " + refreshToken);

    expect(res.statusCode).toEqual(200);
    const DbUser = await UserModel.findOne({ email: user.email });
    expect(DbUser.tokens.length).toBe(0);
  });

  test("Logout Failed, No Token Provided", async () => {
    const res = await request(await appPromise).post("/auth/logout");

    expect(res.statusCode).toEqual(401);
  });

  test("Logout Failed, Invalid Token", async () => {
    const res = await request(await appPromise)
      .post("/auth/logout")
      .set("Authorization", "Bearer invalidToken");

    expect(res.statusCode).toEqual(403);
  });

  test("Logout Failed, User Not Found", async () => {
    const invalidUserToken = jwt.sign(
      { _id: "invalidUserId" },
      process.env.REFRESH_TOKEN_SECRET
    );
    const res = await request(await appPromise)
      .post("/auth/logout")
      .set("Authorization", "Bearer " + invalidUserToken);

    expect(res.statusCode).toEqual(403);
  });
});

describe("Auth - Refresh Token", () => {
  let refreshToken;

  beforeAll(async () => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = await UserModel.create({
      ...user,
      password: hashedPassword,
    });

    refreshToken = generateRefreshToken(
      convertUserToJwtInfo(newUser),
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRATION
    );

    newUser.tokens = [refreshToken];
    await newUser.save();
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: user.email });
  });

  test("Refresh Token Successfully", async () => {
    const res = await request(await appPromise)
      .post("/auth/refresh-token")
      .set("Authorization", "Bearer " + refreshToken);

    expect(res.statusCode).toEqual(200);
  });

  test("Refresh Token Failed, No Token Provided", async () => {
    const res = await request(await appPromise).post("/auth/refresh-token");

    expect(res.statusCode).toEqual(401);
  });

  test("Refresh Token Failed, Invalid Token", async () => {
    const res = await request(await appPromise)
      .post("/auth/refresh-token")
      .set("Authorization", "Bearer invalidToken");

    expect(res.statusCode).toEqual(403);
  });

  test("Refresh Token Failed, User Not Found", async () => {
    const invalidUserToken = jwt.sign(
      { _id: "invalidUserId" },
      process.env.REFRESH_TOKEN_SECRET
    );
    const res = await request(await appPromise)
      .post("/auth/refresh-token")
      .set("Authorization", "Bearer " + invalidUserToken);

    expect(res.statusCode).toEqual(403);
  });
});
