import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  renderHome,
  createStudent,
  listStudents,
  editStudentForm,
  updateStudent,
  deleteStudent,
} from "./controllers/studentController.js";
import {
  listSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "./controllers/subjectController.js";
import { register, login, me } from "./controllers/authController.js";
import { requireAuth } from "./middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// create express app
const app = express();
const PORT = 3000;

// middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get("/", renderHome);
app.post("/students", createStudent);
app.get("/students", listStudents);
app.get("/students/:id/edit", editStudentForm);
app.post("/students/:id/update", updateStudent);
app.post("/students/:id/delete", deleteStudent);

// auth api
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/me", requireAuth, me);

// subject api
app.get("/api/subjects", listSubjects);
app.get("/api/subjects/:id", getSubject);
app.post("/api/subjects", requireAuth, createSubject);
app.put("/api/subjects/:id", requireAuth, updateSubject);
app.delete("/api/subjects/:id", requireAuth, deleteSubject);

// start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
