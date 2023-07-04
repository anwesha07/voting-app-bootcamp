import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';
import { BadRequestException } from '../utils/exceptions';

const validateCreateCandidateDataBody = async (req: Request, _res: Response, next: NextFunction) => {
  const createCandidateSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(18).max(60).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
  });

  try {
    await createCandidateSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    console.log(error.message);
    next(new BadRequestException(error.message));
  }
};

export { validateCreateCandidateDataBody };
