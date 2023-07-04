import Joi from 'joi';
import { BadRequestException } from '../utils/exceptions';
import { Request, Response, NextFunction } from 'express';

const validateRegisterDataBody = async (req: Request, _res: Response, next: NextFunction) => {
const registerBodySchema = Joi.object({
userName: Joi.string().alphanum().min(3).max(30).required(),
aadhaar: Joi.string()
.length(12)
.pattern(/^[0-9]+$/),
email: Joi.string().email().required(),
password: Joi.string().min(8).required(),
confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

try {
await registerBodySchema.validateAsync(req.body);
next();
} catch (error: any) {
  console.log(error);
  next(new BadRequestException(error.message));
}
};

const validateLoginDataBody = async (req: Request, _res: Response, next: NextFunction) => {
const loginBodySchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required(),
});

try {
  await loginBodySchema.validateAsync(req.body);
  next();
} catch (error: any) {
  next(new BadRequestException(error.message));
  console.log(error)
}
};

export { validateRegisterDataBody, validateLoginDataBody };