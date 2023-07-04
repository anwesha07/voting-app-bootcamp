import { Router } from 'express';
import { authenticateUser } from '../middleware';
import {
  getVoteEventsController,
  createVoteEventController,
  getVoteEventByIdController,
  // voteCandidateController,
} from './voteEvents.controller';
import {
  validateVoteEventBody,
  validateVoteCandidateBody,
} from './voteEvents.middleware';

const voteEventRouter = Router();

voteEventRouter.get('/', (_req, res) => {
  res.json({ voteEventroute: 'ok' });
});

// create a voting event
voteEventRouter.post(
  '/',
  authenticateUser,
  validateVoteEventBody,
  createVoteEventController
);

// get all active voting events
voteEventRouter.get('/active', authenticateUser, getVoteEventsController);

// get a voting event by id
voteEventRouter.get('/:id', authenticateUser, getVoteEventByIdController);

// vote a candidate
// voteEventRouter.post(
//   '/:id/vote',
//   authenticateUser,
//   validateVoteCandidateBody,
//   voteCandidateController
// );

export default voteEventRouter;
