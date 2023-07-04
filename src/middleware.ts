import jwt from 'jsonwebtoken';
import { validateToken } from './auth/auth.utils';
import { UnauthorisedException } from './utils/exceptions';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

interface UserIdJwtPayload extends jwt.JwtPayload {
  userId: string
}

const authenticateUser = async (req: CustomRequest, _res: Response, next: NextFunction) => {
const token = req.headers['x-token'] as string;
  try {
    const { userId } = <UserIdJwtPayload>jwt.verify(token, process.env.TOKEN_KEY as string);
    const user = await validateToken(token, userId);
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorisedException((error as Error).message));
    console.log(error);
  }
};

export { authenticateUser };