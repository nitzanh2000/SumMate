import appPromise from "../app";
import mongoose from "mongoose";
import request from "supertest";
import FormData from "form-data";
import { UserModel } from "../models/user_model";
import { PostModel } from "../models/posts_model";
import { convertUserToJwtInfo } from "../utils/auth/auth";
import { generateAccessToken } from "../utils/auth/generate_access_token";
import {
  afterEach,
  afterAll,
  beforeAll,
  describe,
  expect,
  test,
} from "@jest/globals";

const authUser = {
  _id: new mongoose.Types.ObjectId().toString(),
  username: "auth",
  password: "auth",
  email: "auth@auth.auth",
};

const post = { owner: authUser._id, content: "content" };

const posts = [{ ...post }, { ...post }];

const headers = { authorization: "" };

beforeAll(async () => {
  await UserModel.deleteMany({ email: authUser.email });
  await PostModel.deleteMany({ owner: post.owner });

  await appPromise;
  const a = await UserModel.create(authUser);
  headers.authorization =
    "Bearer " +
    generateAccessToken(
      convertUserToJwtInfo(await UserModel.findOne({ email: authUser.email })),
      process.env.ACCESS_TOKEN_SECRET,
      process.env.ACCESS_TOKEN_EXPIRATION
    );
});

afterAll(async () => {
  await UserModel.deleteMany({ email: authUser.email });
  await PostModel.deleteMany({ owner: post.owner });

  await mongoose.connection.close();
});

afterEach(async () => {
  await PostModel.deleteMany({ owner: post.owner });
});

describe("Posts", () => {
  test("Get Many Posts", async () => {
    await PostModel.create(posts);
    const res = await request(await appPromise)
      .get("/posts")
      .set(headers);
    expect(res.statusCode).toEqual(200);
  });

  test("Get Post by ID", async () => {
    await PostModel.create(post);
    const id = (await PostModel.findOne({ owner: post.owner }))._id;
    const res = await request(await appPromise, { headers })
      .get("/posts/" + id)
      .set(headers);
    expect(res.statusCode).toEqual(200);
    const { owner, content } = res.body;
    expect({ owner: owner._id, content }).toEqual(post);
  });

  test("Update Post", async () => {
    await PostModel.create(post);
    const id = (await PostModel.findOne({ owner: post.owner }))._id;

    const form = new FormData();
    form.append("updatedPostContent", JSON.stringify({ ...post, content: "content2" }));

    const res = await request(await appPromise, { headers })
      .put("/posts/" + id)
      .set(headers)
      .set("Content-Type", `multipart/form-data; boundary=${form.getBoundary()}`)
      .send(form.getBuffer());
    expect(res.statusCode).toEqual(201);
    const { owner, content } = await PostModel.findOne({
      content: "content2",
    });
    expect({ owner: owner._id.toString(), content }).toEqual({
      owner: post.owner,
      content: "content2",
    });
  });

  test("Delete Post", async () => {
    await PostModel.create(post);
    const id = (await PostModel.findOne({ owner: post.owner }))._id;

    const res = await request(await appPromise)
      .delete("/posts/" + id)
      .set(headers);
    expect(res.statusCode).toEqual(200);

    const deletedPost = await PostModel.findById(id);
    expect(deletedPost).toBeNull();
  });
});
