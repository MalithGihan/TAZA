import express from "express";
import { userController } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/test", userController.getTest);

export default router;
