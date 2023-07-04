import { Request, Response, NextFunction } from 'express';
import { asyncWrap } from '../utils';
import {
registerUserService,
loginUserService,
logoutUserService,
} from './auth.service';

interface CustomRequest extends Request {
  user?: any; 
}

const registerUserController = asyncWrap(async (req: CustomRequest, res: Response) => {
const { userName, password, email, aadhaar } = req.body;
const user = await registerUserService(userName, password, email, aadhaar);
res.status(201).json(user);
});

const loginUserController = asyncWrap(async (req: CustomRequest, res: Response) => {
const { email, password } = req.body;
const loggedInUser = await loginUserService(email, password);
res.json(loggedInUser);
});

const logoutUserController = asyncWrap(async (req: CustomRequest, res: Response) => {
const userId = req.user?.id;
console.log(`userId: ${userId}`)
const loggedOutUser = await logoutUserService(userId);
res.status(200).json(loggedOutUser);
});

const verifyLoggedInUserController = (req: CustomRequest, res: Response) => {
res.status(200).json({
userId: req.user?._id,
userName: req.user?.userName,
email: req.user?.email,
isLoggedIn: true,
});
};

export {
registerUserController,
loginUserController,
logoutUserController,
verifyLoggedInUserController,
};