import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if the user has a specific role.
 * @param roles - Array of allowed roles
 */
export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;

        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
            return;
        }

        next();
    };
};
