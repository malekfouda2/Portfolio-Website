import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.substring(7);
  
  // Simple token validation - in a real app, use JWT
  if (token === "authenticated-user") {
    req.user = { username: "malekfouda" };
    next();
  } else {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (username === "malekfouda" && password === "Malekfouda1882000") {
    // In a real app, generate a proper JWT token
    res.json({ 
      success: true, 
      token: "authenticated-user",
      user: { username: "malekfouda" }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: "Invalid credentials" 
    });
  }
};