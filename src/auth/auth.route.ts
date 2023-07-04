import express, { Router, Request, Response } from "express";

const authRouter: Router = express.Router();

import {
  validateRegisterDataBody,
  validateLoginDataBody,
} from "./auth.middleware";
import {
  registerUserController,
  loginUserController,
  logoutUserController,
  verifyLoggedInUserController,
} from "./auth.controller";
import { authenticateUser } from "../middleware";

authRouter.get("/", (_req: Request, res: Response) => {
  res.json({ authroute: "ok" });
});

authRouter.post('/register', validateRegisterDataBody, registerUserController);
authRouter.post('/login', validateLoginDataBody, loginUserController);
authRouter.post('/logout', authenticateUser, logoutUserController);
authRouter.post('/verify', authenticateUser, verifyLoggedInUserController);

export default authRouter;