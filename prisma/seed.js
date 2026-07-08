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
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
