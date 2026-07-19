import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "1d";

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Email is invalid."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Email is invalid."),
  password: z.string().min(1, "Password is required."),
});

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export async function register(req, res) {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.error.issues.map((i) => i.message).join(" ") });
  }

  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email is already registered." });
  }

  const hashed = await argon2.hash(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  });

  const token = signToken(user);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

export async function login(req, res) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.error.issues.map((i) => i.message).join(" ") });
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await argon2.verify(user.password, password))) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signToken(user);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

export function me(req, res) {
  res.json({ user: req.user });
}
