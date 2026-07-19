import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const subjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  code: z.string().trim().min(1, "Code is required."),
  credits: z.coerce.number().int().min(0).optional(),
});

export async function listSubjects(req, res) {
  const subjects = await prisma.subject.findMany({ orderBy: { id: "desc" } });
  res.json(subjects);
}

export async function getSubject(req, res) {
  const subject = await prisma.subject.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!subject) return res.status(404).json({ error: "Subject not found." });
  res.json(subject);
}

export async function createSubject(req, res) {
  const result = subjectSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.error.issues.map((i) => i.message).join(" ") });
  }

  const { name, code, credits } = result.data;
  const subject = await prisma.subject.create({
    data: { name, code, credits: credits ?? 0 },
  });
  res.status(201).json(subject);
}

export async function updateSubject(req, res) {
  const result = subjectSchema.partial().safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ error: result.error.issues.map((i) => i.message).join(" ") });
  }

  const subject = await prisma.subject.update({
    where: { id: Number(req.params.id) },
    data: result.data,
  });
  res.json(subject);
}

export async function deleteSubject(req, res) {
  await prisma.subject.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
}
