import express, { Router, Request, Response } from 'express';
import authRouter from './auth/auth.route';
import candidateRouter from './candidate/candidate.route';
import voteEventRouter from './voteEvents/voteEvents.route';

const router: Router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.json({ route: "ok" });
});

router.use("/auth", authRouter);
router.use("/voteEvents", voteEventRouter);
router.use("/candidate", candidateRouter);

export default router;
