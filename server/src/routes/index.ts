import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import AuthRoutes from "./auth.routes.js"
import orderRoutes from "./order.routes.js";
import userRoutes from "./user.routes.js";
import typeRoutes from "./type.routes.js";
import paymentRoutes from "./payment.routes.js";
import orderItemRoutes from "./orderItem.routes.js";
import filterMenuRoutes from "./filterMenu.routes.js";
import menuRoutes from "./menu.routes.js";
import menuSectionRoutes from "./menuSection.routes.js";
import ingredientItemsRoutes from "./ingredientItems.routes.js";
import packageItemsRoutes from "./packageItems.routes.js";
import variantGroupsRoutes from "./variantGroups.routes.js";
import variantItemsRoutes from "./variantItems.routes.js";
import menuVariantGroupsRoutes from "./menuVariantGroups.routes.js";

const router: ExpressRouter= Router();

// 🔥 mount everything here
router.use('/auth', AuthRoutes);
router.use('/orders', orderRoutes);
router.use("/user", userRoutes);
router.use("/types", typeRoutes);
router.use("/payment", paymentRoutes);
router.use("/orderitem", orderItemRoutes);
router.use("/filtermenu", filterMenuRoutes);
router.use("/menu", menuRoutes);
router.use("/menusection", menuSectionRoutes);
router.use("/ingredient", ingredientItemsRoutes);
router.use("/ingredientitem", ingredientItemsRoutes);
router.use("/packageitem", packageItemsRoutes);
router.use("/variantgroup", variantGroupsRoutes);
router.use("/variantitem", variantItemsRoutes);
router.use("/menuvariantgroup", menuVariantGroupsRoutes);

export default router;