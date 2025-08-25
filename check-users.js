const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    })
    console.log('Available users:')
    users.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.email}) - ID: ${user.id}`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()