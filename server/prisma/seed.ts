import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('Seeding database...');
  
  // Hash the password for the test user
  const password = 'Password123!';
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create the test user if they don't exist
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password_hash: hashedPassword,
    },
  });

  console.log(`🌱 Seeded test user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
