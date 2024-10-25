import express from "express";
import { signup, login, checkAuth, getUsers, getUserData, logout } from "./controllers/authentication/authController";
import { checkApiKey, verifyJwt } from "./middlewares/authMiddleware";
import { addProduct } from "./controllers/products/addProductController";
import { getProducts } from "./controllers/products/getProductsController";
import { getHashtags } from "./controllers/hashtags/getHashtagsController";
import { addHashtag } from "./controllers/hashtags/addHashtagController";
import { getCategories } from "./controllers/categories/getCategoriesController";
import { addCategory } from "./controllers/categories/addCategoryController";
import { getSubcategories } from "./controllers/subcategories/getSubcategoriesController";
import { addSubcategory } from "./controllers/subcategories/addSubcategoryController";
import { getSizes } from "./controllers/sizes/getSizesController";
import { addSize } from "./controllers/sizes/addSizeController";
import { getProduct } from "./controllers/products/getSingleProductController";
import { editProduct } from "./controllers/products/editProductController";
import { getCategory } from "./controllers/categories/getSingleCategoryController";
import { editCategory } from "./controllers/categories/editCategoryController";

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
router.post("/add-subcategory", checkApiKey, verifyJwt, addSubcategory);
router.post("/add-size", checkApiKey, verifyJwt, addSize);

router.get("/get-products", checkApiKey, verifyJwt, getProducts);
router.get("/get-hashtags", checkApiKey, verifyJwt, getHashtags);
router.get("/get-categories", checkApiKey, verifyJwt, getCategories);
router.get("/get-subcategories", checkApiKey, verifyJwt, getSubcategories);
router.get("/get-sizes", checkApiKey, verifyJwt, getSizes);

router.get("/get-product/:id", checkApiKey, verifyJwt, getProduct);
router.get("/get-category/:id", checkApiKey, verifyJwt, getCategory);

router.post("/edit-product/:id", checkApiKey, verifyJwt, editProduct);
router.post("/edit-category/:id", checkApiKey, verifyJwt,  editCategory);


export default router;