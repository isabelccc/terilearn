import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create a test user for easier debugging
    const testUserPassword = await hash('password123', 12);
    
    await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        password: testUserPassword,
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: testUserPassword,
        role: 'user',
      },
    });
    
    console.log('Test user created');
    
    // Create admin user
    const adminPassword = await hash('adminpassword', 12);
    
    await prisma.user.upsert({
      where: { email: 'admin@trilearn.com' },
      update: {
        password: adminPassword,
      },
      create: {
        email: 'admin@trilearn.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
      },
    });
    
    console.log('Admin user created');
  } catch (error) {
    console.error('Error in seed:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 