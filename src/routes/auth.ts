import express from "express";
import { signup, login, refresh } from "../controller/auth";
import { validateReqBody } from "../middlewares/validator";
import { createUserBodySchema } from "../schema/users";
import { LoginSchema, RefreshSchema } from "../schema/auth";

const router = express();

router.post("/signup", validateReqBody(createUserBodySchema), signup);
router.post("/login", validateReqBody(LoginSchema), login);
router.post("/refresh", validateReqBody(RefreshSchema), refresh);

export default router;
