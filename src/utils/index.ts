import { HttpException } from './exceptions';
import { Request, Response, NextFunction } from 'express';

const asyncWrap = (func: any) => (req: Request, res: Response, next: NextFunction) =>
func(req, res, next).catch((error: Error) => next(error));

// global error handling middleware
function globalErrorHandler(error: Error, _req: Request, res: Response, next: NextFunction) {
if (res.headersSent) {
// Delegating to built-in error handler
next(error);
return;
}
console.log(error);

// This is my custom error
if (error instanceof HttpException) {
res.status(error.body.statusCode).send({ message: error.body.message });
return;
}

// any unhandled error
res.status(500).send({ message: error.message });
}

export { globalErrorHandler, asyncWrap };