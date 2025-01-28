import { Router, Request, Response } from "express";
import { getValidator, postValidator } from "../controllers/dashboard"
import { router as stakeRouter } from "./stake"

const router = Router();

router.get("/", getValidator)
router.post("/", postValidator)

router.use("/stake", stakeRouter)

export { router };