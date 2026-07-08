import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const studentSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  studentId: z.string().trim().min(1, "Student ID is required."),
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Email is invalid."),
  course: z.string().trim().optional().or(z.literal("")),
});

export function renderHome(req, res) {
  res.render("home");
}

export async function createStudent(req, res) {
  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .send(result.error.issues.map((i) => i.message).join(" "));
  }

  const { name, studentId, email, course } = result.data;
  await prisma.student.create({
    data: { name, studentId, email, course: course || null },
  });
  res.redirect("/students");
}

export async function listStudents(req, res) {
  const students = await prisma.student.findMany({ orderBy: { id: "desc" } });
  res.render("list", { students });
}

export async function editStudentForm(req, res) {
  const student = await prisma.student.findUniqueOrThrow({
    where: { id: Number(req.params.id) },
  });
  res.render("edit", { student });
}

export async function updateStudent(req, res) {
  const result = studentSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .send(result.error.issues.map((i) => i.message).join(" "));
  }

  const { name, studentId, email, course } = result.data;
  await prisma.student.update({
    where: { id: Number(req.params.id) },
    data: { name, studentId, email, course: course || null },
  });
  res.redirect("/students");
}

export async function deleteStudent(req, res) {
  await prisma.student.delete({ where: { id: Number(req.params.id) } });
  res.redirect("/students");
}
