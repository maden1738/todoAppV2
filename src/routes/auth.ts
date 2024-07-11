import express from "express";
import { signup, login, refresh } from "../controller/auth";
import { validateReqBody } from "../middlewares/validator";
import { createUserBodySchema } from "../schema/users";

const router = express();

router.post("/signup", validateReqBody(createUserBodySchema), signup);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;
