const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteOrphanedCheckIns() {
  try {
    // Use raw SQL to delete check-ins without assessmentId
    const result = await prisma.$executeRaw`DELETE FROM CheckIn WHERE assessmentId IS NULL`;
    
    console.log(`Deleted ${result} orphaned check-ins without assessmentId`);
    
  } catch (error) {
    console.error('Error deleting orphaned check-ins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOrphanedCheckIns();