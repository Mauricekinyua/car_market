import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { requireAuth } from "./auth";

export const uploads = Router();
