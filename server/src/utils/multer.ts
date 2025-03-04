import path from "path";
import * as fs from "fs";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `public/images`);
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export const uploadFile = (req: Request, res: Response): Promise<void> => {
  return new Promise((resolve, reject) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const deleteFile = (filename) => {
  const filePath = `public/images/${filename}`;
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
