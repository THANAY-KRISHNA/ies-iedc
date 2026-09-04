import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../src/types';
import { db } from './db';

// Extends express request to store authenticated user
export interface AuthRequest extends Request {
  user?: User;
}

// In-memory token store for sessions
const sessionTokens: Map<string, User> = new Map();

// Initialize demo sessions
export function initializeAuth() {
  const users = db.getUsers();
  users.forEach(u => {
    sessionTokens.set(`token_${u.id}`, u);
  });
}

// Middleware: Authenticate session
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  const user = sessionTokens.get(token);
  if (!user) {
    return res.status(403).json({ error: 'Session expired or invalid token.' });
  }

  req.user = user;
  next();
}

// Middleware: Role Check
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    // Super Admin has access to everything
    if (req.user.role === 'Super Admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden. Role "${req.user.role}" does not have required permissions for this action. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

// Login helper
export function loginUser(email: string): { user: User; token: string } | null {
  const users = db.getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const token = `token_${user.id}`;
  user.lastLogin = new Date().toISOString();
  sessionTokens.set(token, user);
  return { user, token };
}
