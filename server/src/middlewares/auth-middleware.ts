import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET não configurado no .env");
  }

  return jwtSecret;
}

export function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token não informado.",
    });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return response.status(401).json({
      message: "Token inválido.",
    });
  }

  try {
    jwt.verify(token, getJwtSecret());

    return next();
  } catch {
    return response.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}