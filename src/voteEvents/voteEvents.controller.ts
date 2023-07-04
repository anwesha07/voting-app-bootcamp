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
  const userId = req.user.id;
  const voteEvents = await getVoteEventsService(parseInt(userId));
  res.json(voteEvents);
});

const createVoteEventController = asyncWrap(async (req: CustomRequest, res: Response) => {
  if (!req.user.isadmin) {
    throw new ForbiddenException('Not allowed!');
  }
  const { name, startDate, endDate, candidates } = req.body;
  const newVoteEvent = await createVoteEventService(
    name,
    startDate,
    endDate,
    candidates
  );
  res.status(201).json(newVoteEvent);
});

const getVoteEventByIdController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const eventId = parseInt(req.params.id);
  const voteEvent = await getVoteEventByIdService(eventId);
  res.json(voteEvent);
});

const voteCandidateController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const candidateId = parseInt(req.body.candidate);
  const userId = parseInt(req.user.id);
  const eventId = parseInt(req.params.id);
  await voteCandidateService(candidateId, userId, eventId);
  res.status(201).json({ message: 'Vote casted successfully' });
});

export {
  getVoteEventsController,
  createVoteEventController,
  getVoteEventByIdController,
  voteCandidateController,
};
