import { Request, Response, NextFunction } from 'express';
import { asyncWrap } from '../utils';
import { ForbiddenException } from '../utils/exceptions';
import {
  getVoteEventsService,
  createVoteEventService,
  voteCandidateService,
  getVoteEventByIdService,
} from './voteEvents.service';


interface CustomRequest extends Request {
  user?: any; 
}

const getVoteEventsController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const userId = req.user._id;
  const voteEvents = await getVoteEventsService(userId);
  res.json(voteEvents);
});

const createVoteEventController = asyncWrap(async (req: CustomRequest, res: Response) => {
  if (!req.user.isAdmin) {
    throw new ForbiddenException('Not allowed!');
  }
  const { name, startDate, endDate, candidates } = req.body;
  const newVoteEvent = await createVoteEventService(
    name,
    startDate,
    endDate,
    candidates,
  );
  res.status(201).json(newVoteEvent);
});

const getVoteEventByIdController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const eventId = req.params.id;
  const userId = req.user._id;
  const voteEvent = await getVoteEventByIdService(eventId, userId);
  res.json(voteEvent);
});

const voteCandidateController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const candidateId = req.body.candidate;
  const userId = req.user._id;
  const eventId = req.params.id;
  await voteCandidateService(candidateId, userId, eventId);
  res.status(201).json({ message: 'Vote casted successfully' });
});

export {
  getVoteEventsController,
  createVoteEventController,
  getVoteEventByIdController,
  voteCandidateController,
};
