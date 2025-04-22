import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'noneofyourbusiness';

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const authMiddleware =async  (req: AuthRequest, res: Response, next: NextFunction):Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return 
    }
    type MyTokenPayload = {
      userId: string;
    };
    const decoded = jwt.verify(token, JWT_SECRET) as MyTokenPayload;
    const user = await User.findById(decoded.userId); // check in MongoDB

    if (!user) {
      res.status(401).json({ message: "User does not exist" });
      return
    }
    // @ts-ignore 
    req.userId = decoded.userId;
    // req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
    return 
}

};
