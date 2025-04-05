import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Fetch files for the current user
    const files = await prisma.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    return res.status(200).json({
      files,
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return res.status(500).json({ 
      message: 'Error fetching files',
      error: error.message,
    });
  }
} 