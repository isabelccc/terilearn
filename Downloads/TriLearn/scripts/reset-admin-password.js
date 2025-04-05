const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function resetPassword() {
  const newPassword = 'adminpassword123'; // Choose a simple password for testing
  const hashedPassword = await hash(newPassword, 12);
  
  try {
    const user = await prisma.user.update({
      where: { email: 'Trilearn@admin.com' },
      data: { password: hashedPassword }
    });
    
    console.log(`Password reset for user: ${user.email}`);
    console.log(`New password is: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword(); 