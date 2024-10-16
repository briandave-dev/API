import express from "express";
import { signup, login, checkAuth, getUsers, getUserData, logout } from "./controllers/authentication/authController";
import { checkApiKey, verifyJwt } from "./middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", checkApiKey, signup);
router.post("/login", checkApiKey, login);
router.get("/logout", checkApiKey, logout);
router.get("/checkauth", checkApiKey, verifyJwt, checkAuth);
router.get("/get-users", checkApiKey, verifyJwt, getUsers)
router.get("/get-user", checkApiKey, verifyJwt, getUserData)

export default router;