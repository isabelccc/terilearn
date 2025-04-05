import type { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { prisma } from '../../../lib/prisma';

// This should only be accessible via a secure token or in development
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV !== 'development' && req.headers.authorization !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@trilearn.com' }
    });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await hash('adminpassword123', 12);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@trilearn.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin'
      }
    });

    return res.status(201).json({ 
      message: 'Admin created successfully',
      admin: { id: admin.id, email: admin.email, role: admin.role }
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    return res.status(500).json({ message: 'Failed to create admin user' });
  }
} 