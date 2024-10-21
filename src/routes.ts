import express from "express";
import { signup, login, checkAuth, getUsers, getUserData, logout } from "./controllers/authentication/authController";
import { checkApiKey, verifyJwt } from "./middlewares/authMiddleware";
import { addProduct } from "./controllers/products/addProductController";
import { getProducts } from "./controllers/products/getProductsController";

const router = express.Router();

router.post("/signup", checkApiKey, signup);
router.post("/login", checkApiKey, login);
router.get("/logout", checkApiKey, logout);
router.get("/checkauth", checkApiKey, verifyJwt, checkAuth);
router.get("/get-users", checkApiKey, verifyJwt, getUsers);
router.get("/get-user", checkApiKey, verifyJwt, getUserData);
router.post("/add-product", checkApiKey, verifyJwt, addProduct);
router.get("/get-products", checkApiKey, verifyJwt, getProducts);


export default router;