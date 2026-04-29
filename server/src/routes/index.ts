import { Router } from "express";
import typeRoutes from "./type.routes.js";
import sectionRoutes from "./menuSection.routes.js";
import filterRoutes from "./filterMenu.routes.js";
import menuRoutes from "./menu.routes.js";

const router:Router = Router();
router.use("/types", typeRoutes);
router.use("/sections", sectionRoutes);
router.use("/filters", filterRoutes);
router.use("/menus", menuRoutes);
export default router;