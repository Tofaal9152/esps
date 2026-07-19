import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const students = Array.from({ length: 200 }, (_, i) => {
    return {
      name: `naiem`,
      studentId: `2311`,
      email: `naiem@gmail.com`,
      course: `cse`,
    };
  });

  await prisma.student.createMany({ data: students });
  console.log(`Seeded ${students.length} students.`);

  const subjects = [
    { name: "Data Structures", code: "CSE201", credits: 3 },
    { name: "Algorithms", code: "CSE202", credits: 3 },
    { name: "Database Systems", code: "CSE303", credits: 3 },
    { name: "Operating Systems", code: "CSE304", credits: 3 },
    { name: "Computer Networks", code: "CSE305", credits: 3 },
  ];

  await prisma.subject.createMany({ data: subjects });
  console.log(`Seeded ${subjects.length} subjects.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
