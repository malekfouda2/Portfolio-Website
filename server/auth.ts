import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { storage } from "./storage";

type AuthenticatedUser = {
  id: number;
  username: string;
};

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") {
    return "local-development-only-secret";
  }
  throw new Error("JWT_SECRET must be configured in production");
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = jwt.verify(authHeader.slice(7), getJwtSecret(), {
      issuer: "malekfouda.com",
      audience: "portfolio-admin",
    }) as JwtPayload;
    const userId = Number(payload.sub);
    const username = typeof payload.username === "string" ? payload.username : "";
    if (!Number.isInteger(userId) || !username) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.user = { id: userId, username };
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const login = async (username: string, password: string) => {
  let user = await storage.getUserByUsername(username);

  // Bootstrap a first administrator only from explicitly configured secrets.
  if (!user) {
    const bootstrapUsername = process.env.ADMIN_USERNAME;
    const bootstrapPassword = process.env.ADMIN_PASSWORD;
    if (
      bootstrapUsername &&
      bootstrapPassword &&
      username === bootstrapUsername &&
      password === bootstrapPassword
    ) {
      user = await storage.createUser({
        username,
        password: await bcrypt.hash(password, 12),
      });
    }
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { success: false as const, error: "Invalid credentials" };
  }

  const token = jwt.sign(
    { username: user.username },
    getJwtSecret(),
    {
      subject: String(user.id),
      issuer: "malekfouda.com",
      audience: "portfolio-admin",
      expiresIn: "8h",
    },
  );

  return {
    success: true as const,
    token,
    user: { id: user.id, username: user.username },
  };
};

export const loginHandler = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const result = await login(username, password);
  if (!result.success) {
    return res.status(401).json(result);
  }
  return res.json(result);
};
