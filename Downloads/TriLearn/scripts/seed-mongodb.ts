import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminPassword = await hash('Trilearnadmin', 12);
    
    const admin = await prisma.user.upsert({
      where: { email: 'Trilearn@admin.com' },
      update: {
        password: adminPassword,
      },
      create: {
        email: 'Trilearn@admin.com',
        name: 'Admin User',
        password: adminPassword,
        role: 'admin',
      },
    });
    
    console.log('Admin user created:', admin.email);
    
    // Create test user for easier testing
    const testPassword = await hash('password123', 12);
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {
        password: testPassword,
      },
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: testPassword,
        role: 'user',
      },
    });
    
    console.log('Test user created:', testUser.email);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 