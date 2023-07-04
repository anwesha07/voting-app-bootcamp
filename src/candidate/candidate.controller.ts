import { Request, Response } from 'express';
import { asyncWrap } from '../utils';
import { createNewCandidate, getCandidate } from './candidate.service';

interface CustomRequest extends Request {
  user?: any; 
}


const createCandidateController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const { user } = req;
  const { name, email, age, gender } = req.body;
  const newCandidate = await createNewCandidate(user, name, email, age, gender);
  res.status(201).json(newCandidate);
});

const fetchCandidateController = asyncWrap(async (req: CustomRequest, res: Response) => {
  const candidateId = req.params.id;
  const candidate = await getCandidate(candidateId);
  res.status(200).json(candidate);
});

export { createCandidateController, fetchCandidateController };
