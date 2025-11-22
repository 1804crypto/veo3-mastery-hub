const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addGoogleIdColumn() {
    try {
        // Try to execute raw SQL to add the column
        await prisma.$executeRaw`ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE`;
        console.log('✅ Successfully added google_id column');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addGoogleIdColumn();
