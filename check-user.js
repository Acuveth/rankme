const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkUser() {
  try {
    // First check what users exist
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })
    
    console.log('All users in database:')
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.name || 'No name'}) - Created: ${user.createdAt}`)
    })
    console.log('Total users:', allUsers.length)
    
    const user = await prisma.user.findUnique({
      where: { email: 'lukagaberscek3@gmail.com' }
    })
    
    if (user) {
      console.log('\nSpecific user found:')
      console.log('- ID:', user.id)
      console.log('- Email:', user.email)
      console.log('- Name:', user.name)
      console.log('- Has password:', !!user.password)
      console.log('- Created at:', user.createdAt)
      
      // If no password, create one
      if (!user.password) {
        const password = 'temppass123'
        const hashedPassword = await bcrypt.hash(password, 10)
        
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        })
        
        console.log('\nTemporary password set:', password)
        console.log('Please change this password after logging in!')
      } else {
        console.log('\nPassword already exists. If you forgot it, you can reset it manually.')
      }
    } else {
      console.log('\nUser not found with email: lukagaberscek3@gmail.com')
      console.log('Would you like me to create this user account?')
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()