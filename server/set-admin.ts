import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email address.');
        process.exit(1);
    }

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { is_admin: true },
        });
        console.log(`User ${user.email} is now an admin.`);
    } catch (error) {
        console.error('Error updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
