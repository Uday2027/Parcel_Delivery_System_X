import {Router } from "express";
import { userControllers } from "./user.controller";
import {createUSerZodSchema} from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

import { Role } from "./user.interface";

import { checkAuth } from "../../middlewares/checkAuth";


const router = Router();



router.post("/register", validateRequest(createUSerZodSchema), userControllers.createUser);
router.post("/register-admin", checkAuth(Role.SUPER_ADMIN), userControllers.createAdmin)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUsers);
router.get("/search", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), userControllers.searchUsers);
router.patch("/:id", checkAuth(...Object.values(Role)), userControllers.updateUser);
router.patch("/live-location/update", checkAuth(Role.DELIVERY_BOY, Role.ADMIN, Role.SUPER_ADMIN), userControllers.updateLiveLocation);

export const userRoutes = router;