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
import { getHashtag } from "./controllers/hashtags/getSingleHashtag";
import { editHashtag } from "./controllers/hashtags/editHashtagController";
import { getBillboards } from "./controllers/billboards/getBillboardsController";
import { getClientProducts } from "./controllers/products/getClientProductsController";
import { addBillboard } from "./controllers/billboards/addBillboardController";
import { editBillboard } from "./controllers/billboards/editBillboardController";
import { getBillboard } from "./controllers/billboards/getSingleBillboardController";

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
router.post("/add-billboard", checkApiKey, verifyJwt, addBillboard);

router.get("/get-products", checkApiKey, getProducts);
router.get("/get-client-products", checkApiKey, getClientProducts);

router.get("/get-hashtags", checkApiKey, getHashtags);
router.get("/get-categories", checkApiKey, getCategories);
router.get("/get-subcategories", checkApiKey, getSubcategories);
router.get("/get-sizes", checkApiKey, getSizes);
router.get("/get-billboards", checkApiKey, getBillboards);

router.get("/get-product/:id", checkApiKey, getProduct);
router.get("/get-category/:id", checkApiKey, getCategory);
router.get("/get-hashtag/:id", checkApiKey, getHashtag);
router.get("/get-billboard/:id", checkApiKey, getBillboard);


router.post("/edit-product/:id", checkApiKey, verifyJwt, editProduct);
router.post("/edit-category/:id", checkApiKey, verifyJwt, editCategory);
router.post("/edit-hashtag/:id", checkApiKey, verifyJwt, editHashtag);
router.post("/edit-billboard/:id", checkApiKey, verifyJwt, editBillboard);


export default router;