import appPromise from "../app";
import request from "supertest";
import { generateAccessToken } from "../utils/auth/generate_access_token";
import { convertUserToJwtInfo } from "../utils/auth/auth";
import { UserModel } from "../models/user_model";
import mongoose from "mongoose";

const headers = { authorization: "" };
const user = {
  _id: new mongoose.Types.ObjectId().toString(),
  username: "auth",
  password: "auth",
  email: "auth@auth.auth",
};

beforeAll(async () => {
  await appPromise;

  await UserModel.create(user);

  headers.authorization =
    "Bearer " +
    generateAccessToken(
      convertUserToJwtInfo(await UserModel.findOne({ email: user.email })),
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRATION
    );
});

afterAll(async () => {
  await UserModel.deleteMany({ email: user.email });
  await mongoose.connection.close();
});

describe("AI", () => {
  test("Success", async () => {
    const res = await request(await appPromise)
      .post("/api/AI/api/improve-text")
      .set(headers)
      .send({text: "try to send text"});

    expect(res.statusCode).toEqual(200);
  });
});
