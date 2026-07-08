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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// create express app
const app = express();
const PORT = 3000;

// middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", renderHome);
app.post("/students", createStudent);
app.get("/students", listStudents);
app.get("/students/:id/edit", editStudentForm);
app.post("/students/:id/update", updateStudent);
app.post("/students/:id/delete", deleteStudent);

// start server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
