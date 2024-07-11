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
import { validateReqBody, validateReqQuery } from "../middlewares/validator";
import {
     createUserBodySchema,
     GetUserQuerySchema,
     updateUserBodySchema,
} from "../schema/users";

const router = express();

router.get(
     "/",
     validateReqQuery(GetUserQuerySchema),
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     getUser
);
router.get(
     "/:id",
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     getUserById
);
router.post(
     "/",
     validateReqBody(createUserBodySchema),
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     createUser
);
router.put(
     "/:id",
     validateReqBody(updateUserBodySchema),
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     updateUser
);
router.delete(
     "/:id",
     authenticate,
     authorize(PERMISSION.SUPER_ADMIN),
     deleteUser
);

export default router;
