import { errorHandler } from "../error-handler";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  searchProducts,
  updateProduct,
} from "../controllers/products";
import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import adminMiddleware from "../middlewares/admin";

const productRoutes: Router = Router();

productRoutes.post(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(createProduct)
);
productRoutes.post(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(updateProduct)
);
productRoutes.delete(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(deleteProduct)
);
productRoutes.get(
  "/",
  [authMiddleware, adminMiddleware],
  errorHandler(listProducts)
);
productRoutes.get("/search", [authMiddleware], errorHandler(searchProducts))

// /search?q=""

productRoutes.get(
  "/:id",
  [authMiddleware, adminMiddleware],
  errorHandler(getProductById)
);

export default productRoutes;
