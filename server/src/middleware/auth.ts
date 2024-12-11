import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwtUtils';
import { JwtPayload } from '../utils/jwtUtils'; // Import your payload type

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header is missing' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyToken(token);

        // Use type assertion to inform TypeScript about the `user` property
        (req as any).user = payload as JwtPayload;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};