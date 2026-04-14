import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@digitalcursos.com' },
    update: {},
    create: {
      email: 'admin@digitalcursos.com',
      name: 'Admin DigitalCursos',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const studentPassword = await bcrypt.hash('student123', 10);
  await prisma.user.upsert({
    where: { email: 'ana@student.com' },
    update: {},
    create: {
      email: 'ana@student.com',
      name: 'Ana Oliveira',
      password: studentPassword,
      role: 'STUDENT',
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
