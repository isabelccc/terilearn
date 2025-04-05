import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';
import { getMaxFilesByPlanName } from '../../../lib/plans';

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
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        planType: true,
        filesUploaded: true,
        subscriptionEnd: true,
      },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get max files allowed for the user's plan
    const maxFiles = getMaxFilesByPlanName(user.planType as any);
    
    return res.status(200).json({
      planType: user.planType,
      filesUploaded: user.filesUploaded,
      maxFiles,
      filesRemaining: Math.max(0, maxFiles - user.filesUploaded),
      percentUsed: Math.min(100, Math.round((user.filesUploaded / maxFiles) * 100)),
      subscriptionEnd: user.subscriptionEnd,
    });
  } catch (error) {
    console.error('Error fetching plan info:', error);
    return res.status(500).json({ 
      message: 'Error fetching plan info',
      error: error.message,
    });
  }
} 