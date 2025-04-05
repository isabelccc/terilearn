import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const password = 'adminpassword123';
  const hashedPassword = await hash(password, 12);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@trilearn.com' },
      update: {},
      create: {
        email: 'admin@trilearn.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('Admin created:', admin);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 