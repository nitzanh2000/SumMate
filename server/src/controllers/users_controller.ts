import { User } from "../dtos/user";
import { Request, Response } from "express";
import { UserModel } from "../models/user_model";

const getMe = async (req: Request & { user: User }, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export {
  getMe,
};
