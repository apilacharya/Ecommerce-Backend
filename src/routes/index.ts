import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./products";
import usersRoutes from "./users";
import cartRoutes from "./cart";
import orderRoutes from "./order";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/products", productRoutes);
rootRouter.use("/users", usersRoutes);
rootRouter.use("/carts", cartRoutes);
rootRouter.use("/orders", orderRoutes);

export default rootRouter;


/* 
1. User management
    a. list users
    b. get user by id
    c. change user role

2. order management
    a.list all orders (fiilter on status)
    b. change order status
    c. list all order of give user
    
3. products
    a. search api for products (for both users and admin) -> full text search    
*/