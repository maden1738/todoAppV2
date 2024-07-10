import express from "express";
import {
     createUser,
     deleteUser,
     getUser,
     getUserById,
     updateUser,
} from "../controller/user";
import { authenticate, authorize } from "../middlewares/auth";
import { PERMISSION } from "../constants/permissions";

const router = express();

router.get("/", authenticate, authorize(PERMISSION.SUPER_ADMIN), getUser);
router.get(
     "/:id",
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     getUserById
);
router.post("/", authenticate, authorize(PERMISSION.SUPER_ADMIN), createUser);
router.put("/:id", authenticate, authorize(PERMISSION.SUPER_ADMIN), updateUser);
router.delete(
     "/:id",
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     deleteUser
);

export default router;
