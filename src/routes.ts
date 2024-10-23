import express from "express";
import { signup, login, checkAuth, getUsers, getUserData, logout } from "./controllers/authentication/authController";
import { checkApiKey, verifyJwt } from "./middlewares/authMiddleware";
import { addProduct } from "./controllers/products/addProductController";
import { getProducts } from "./controllers/products/getProductsController";
import { getHashtags } from "./controllers/hashtags/getHashtagsController";
import { addHashtag } from "./controllers/hashtags/addHashtagController";
import { getCategories } from "./controllers/categories/getCategoriesController";
import { addCategory } from "./controllers/categories/addCategoryController";

const router = express.Router();

router.post("/signup", checkApiKey, signup);
router.post("/login", checkApiKey, login);
router.get("/logout", checkApiKey, logout);
router.get("/checkauth", checkApiKey, verifyJwt, checkAuth);
router.get("/get-users", checkApiKey, verifyJwt, getUsers);
router.get("/get-user", checkApiKey, verifyJwt, getUserData);

router.post("/add-product", checkApiKey, verifyJwt, addProduct);
router.post("/add-hashtag", checkApiKey, verifyJwt, addHashtag);
router.post("/add-category", checkApiKey, verifyJwt, addCategory);

router.get("/get-products", checkApiKey, verifyJwt, getProducts);
router.get("/get-hashtags", checkApiKey, verifyJwt, getHashtags);
router.get("/get-categories", checkApiKey, verifyJwt, getCategories);

export default router;