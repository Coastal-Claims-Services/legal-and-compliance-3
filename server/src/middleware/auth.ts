import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Use a single, consistent secret, with a fallback for local development.
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Token blacklist for abusive users (in production, use Redis or database)
const blacklistedTokens = new Set<string>();

// Function to blacklist a token
export const blacklistToken = (token: string) => {
    blacklistedTokens.add(token);
    console.log(`🚫 Token blacklisted: ${token.substring(0, 20)}...`);
};

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    (async () => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                res.status(401).json({ error: 'Access token is required' });
                return;
            }

            // Check if token is blacklisted
            if (blacklistedTokens.has(token)) {
                res.status(401).json({ 
                    error: 'Token has been revoked due to suspicious activity. Please log in again.',
                    code: 'TOKEN_BLACKLISTED'
                });
                return;
            }
            
            // jwt.verify is synchronous and will throw an error if the token is invalid or expired.
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            
            const user = await User.findById(decoded.userId)
                .populate('departments')
                .populate('licenses')
                .populate('bonds');

            if (!user) {
                res.status(401).json({ error: 'Invalid token: user not found.' });
                return;
            }

            if (user.status === 'inactive') {
                res.status(401).json({ error: 'Your account is inactive.' });
                return;
            }

            req.user = user;
            next();
        } catch (error: any) {
            // This unified catch block will handle JWT errors (like expiration) and other exceptions.
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                res.status(401).json({ error: 'Session expired or token is invalid. Please log in again.' });
                return;
            }
            
            console.error('Unexpected error in auth middleware:', error);
            // Pass the error to the next error-handling middleware.
            next(error);
        }
    })();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }
    next();
};

export const requireRole = (roles: string | string[]) => {
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !requiredRoles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient privileges' });
            return;
        }
        next();
    };
}; 