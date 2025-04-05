import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';
import { getMaxFilesByPlanName } from '../../../lib/plans';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        planType: true,
        filesUploaded: true,
        subscriptionEnd: true,
        _count: {
          select: { files: true }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Get the actual count of files from the database
    const fileCount = user._count.files;
    
    // Get max files based on plan
    const maxFiles = getMaxFilesByPlanName(user.planType as any);
    
    return res.status(200).json({
      success: true,
      planType: user.planType,
      filesUploaded: fileCount,
      maxFiles,
      remaining: maxFiles - fileCount,
      percentUsed: Math.min(100, Math.round((fileCount / maxFiles) * 100)),
      subscriptionEnd: user.subscriptionEnd
    });
  } catch (error) {
    console.error('Failed to get plan usage:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
} 