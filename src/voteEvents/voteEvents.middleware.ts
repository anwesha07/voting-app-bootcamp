import Joi from 'joi';
import { BadRequestException } from '../utils/exceptions';
import { Request, Response, NextFunction } from 'express';

const validateVoteEventBody = async (req: Request, _res: Response, next: NextFunction) => {
  const voteEventSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    startDate: Joi.date().greater('now').required(),
    endDate: Joi.date().greater('now').greater(Joi.ref('startDate')).required(),
    candidates: Joi.array().items(Joi.number()).min(2).required(),
  });

  try {
    await voteEventSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    console.log(error.message);
    next(new BadRequestException(error.message));
  }
};

const validateVoteCandidateBody = async (req: Request, _res: Response, next: NextFunction) => {
  const validateVoteCandidateSchema = Joi.object({
    candidate: Joi.number().required(),
  });

  try {
    await validateVoteCandidateSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    console.log(error.message);
    next(new BadRequestException(error.message));
  }
};

export { validateVoteEventBody, validateVoteCandidateBody };
