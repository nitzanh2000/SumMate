import { User } from "../dtos/user";
import { Request, Response } from "express";
import { UserModel } from "../models/user_model";
import { deleteFile, uploadFile } from "../utils/multer";

const updateUser = async (req: Request, res: Response) => {
  try {
    await uploadFile(req, res);
    const username: string = req.body.username;

    const userId: string = req.params.userId;
    const updatedUserData: Partial<User> = {
      username,
      ...(req.file && req.file.filename && { photo: req.file.filename }),
    };

    const existingUser = await UserModel.findOne({
      username: updatedUserData.username,
    });

    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).send("Username already exists");
    }

    const currentUserPhoto = (await UserModel.findById(userId)).photo;

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
      updatedUserData,
      { new: true }
    );

    if (updatedUser) {
      currentUserPhoto && deleteFile(currentUserPhoto);
      res.status(201).send(updatedUser);
    } else {
      req.file?.filename && deleteFile(req.file.filename);
      res.status(404).send("Cannot find specified user");
    }
  } catch (error) {
    req.file?.filename && deleteFile(req.file.filename);
    res.status(500).send(error.message);
  }
};

const getMe = async (req: Request & { user: User }, res: Response) => {
  try {
    const user = await UserModel.findById(req.user._id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export {
  updateUser,
  getMe,
};
