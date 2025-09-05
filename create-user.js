const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createUser() {
  try {
    const email = 'lukagaberscek3@gmail.com'
    const password = 'temppass123'  // You can change this
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email: email,
        name: 'Luka Gaberscek',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    
    console.log('User created successfully:')
    console.log('- ID:', user.id)
    console.log('- Email:', user.email)
    console.log('- Name:', user.name)
    console.log('- Password:', password)
    console.log('\nYou can now log in with these credentials!')
    console.log('Go to: http://localhost:3000/auth/signin')
    
  } catch (error) {
    console.error('Error creating user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createUser()