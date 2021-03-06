import express from "express";
import { ImageController } from "../controller/ImageController";

export const imageRouter = express.Router();

const imageController = new ImageController();

imageRouter.post("/", imageController.addImage);
imageRouter.get("/", imageController.getAlbumImages)
imageRouter.get("/:id", imageController.getImageById)
