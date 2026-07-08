import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// create express app
const app = express();
const PORT = 3000;
const prisma = new PrismaClient();

// middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// validation
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

// api
app.get("/", (req, res) => {
  res.render("home");
});

app.post("/students", async (req, res) => {
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
});

app.get("/students", async (req, res) => {
  const students = await prisma.student.findMany({ orderBy: { id: "desc" } });
  res.render("list", { students });
});

app.get("/students/:id/edit", async (req, res) => {
  const student = await prisma.student.findUniqueOrThrow({
    where: { id: Number(req.params.id) },
  });
  res.render("edit", { student });
});

app.post("/students/:id/update", async (req, res) => {
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
});

app.post("/students/:id/delete", async (req, res) => {
  await prisma.student.delete({ where: { id: Number(req.params.id) } });
  res.redirect("/students");
});

// start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
