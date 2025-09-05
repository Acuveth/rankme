const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupCheckIns() {
  try {
    // Delete all existing check-ins since they don't have assessmentId
    const deleteResult = await prisma.checkIn.deleteMany({
      where: {
        assessmentId: null
      }
    });
    
    console.log(`Deleted ${deleteResult.count} orphaned check-ins without assessmentId`);
    
    // Optional: If you want to keep them and assign to user's latest assessment
    // const checkInsWithoutAssessment = await prisma.checkIn.findMany({
    //   where: { assessmentId: null },
    //   include: { user: true }
    // });
    
    // for (const checkIn of checkInsWithoutAssessment) {
    //   const latestAssessment = await prisma.assessment.findFirst({
    //     where: { userId: checkIn.userId },
    //     orderBy: { createdAt: 'desc' }
    //   });
      
    //   if (latestAssessment) {
    //     await prisma.checkIn.update({
    //       where: { id: checkIn.id },
    //       data: { assessmentId: latestAssessment.id }
    //     });
    //     console.log(`Updated check-in ${checkIn.id} with assessment ${latestAssessment.id}`);
    //   }
    // }
    
  } catch (error) {
    console.error('Error cleaning up check-ins:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupCheckIns();