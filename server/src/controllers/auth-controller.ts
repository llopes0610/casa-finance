import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { supabase } from "../lib/supabase";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET não configurado no .env");
  }

  return jwtSecret;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function registerUser(request: Request, response: Response) {
  const { name, email, password } = request.body as RegisterBody;

  if (!name || name.trim().length < 3) {
    return response.status(400).json({
      message: "Informe um nome válido.",
    });
  }

  if (!email || !email.includes("@")) {
    return response.status(400).json({
      message: "Informe um e-mail válido.",
    });
  }

  if (!password || password.length < 6) {
    return response.status(400).json({
      message: "A senha precisa ter pelo menos 6 caracteres.",
    });
  }

  const normalizedEmail = normalizeEmail(email);

  const { data: existingUser, error: existingUserError } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingUserError) {
    return response.status(500).json({
      message: "Erro ao verificar usuário.",
      error: existingUserError.message,
    });
  }

  if (existingUser) {
    return response.status(409).json({
      message: "Já existe um usuário cadastrado com este e-mail.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
    })
    .select("id, name, email, created_at")
    .single();

  if (error) {
    return response.status(500).json({
      message: "Erro ao cadastrar usuário.",
      error: error.message,
    });
  }

  return response.status(201).json({
    id: data.id,
    name: data.name,
    email: data.email,
    createdAt: data.created_at,
  });
}

export async function loginUser(request: Request, response: Response) {
  const { email, password } = request.body as LoginBody;

  if (!email || !email.includes("@")) {
    return response.status(400).json({
      message: "Informe um e-mail válido.",
    });
  }

  if (!password) {
    return response.status(400).json({
      message: "Informe a senha.",
    });
  }

  const normalizedEmail = normalizeEmail(email);

  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, password_hash")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    return response.status(500).json({
      message: "Erro ao buscar usuário.",
      error: error.message,
    });
  }

  if (!user) {
    return response.status(401).json({
      message: "E-mail ou senha inválidos.",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    return response.status(401).json({
      message: "E-mail ou senha inválidos.",
    });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );

  return response.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
}