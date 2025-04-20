import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_PASSWORD } from './config';

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers['authorization'] as string;
  const decoded = jwt.verify(headers, JWT_PASSWORD);
  if (decoded) {
    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({ message: 'you are not logged in' });
  }
};
