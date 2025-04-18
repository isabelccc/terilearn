import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Test the connection by getting a count of users
    const userCount = await prisma.user.count();
    
    return res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      userCount,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
} 