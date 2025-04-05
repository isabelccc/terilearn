const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  // Set this to your preferred password
  const newPassword = 'admin123';
  
  try {
    // Check for admin accounts
    const admins = await prisma.user.findMany({
      where: {
        role: 'admin'
      }
    });
    
    console.log('Found admin accounts:', admins.map(a => a.email));
    
    // Create a new admin if none exists
    if (admins.length === 0) {
      const hashedPassword = await hash(newPassword, 12);
      
      await prisma.user.create({
        data: {
          email: 'admin@trilearn.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'admin'
        }
      });
      
      console.log('Created new admin account:');
      console.log('Email: admin@trilearn.com');
      console.log('Password:', newPassword);
    } 
    // Update password for existing admin
    else {
      const hashedPassword = await hash(newPassword, 12);
      
      for (const admin of admins) {
        await prisma.user.update({
          where: { id: admin.id },
          data: { password: hashedPassword }
        });
      }
      
      console.log('Reset password for admin accounts:');
      admins.forEach(admin => {
        console.log(`Email: ${admin.email}`);
      });
      console.log('New password:', newPassword);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin(); 