import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { planType, isYearly } = req.body;
    
    // Calculate subscription end date based on billing cycle
    const subscriptionEnd = new Date();
    if (isYearly) {
      subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);
    } else {
      subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    }
    
    // Update user plan
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        planType,
        subscriptionEnd,
      },
    });
    
    return res.status(200).json({
      message: 'Plan updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        planType: updatedUser.planType,
        subscriptionEnd: updatedUser.subscriptionEnd,
      },
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    return res.status(500).json({ 
      message: 'Error updating plan',
      error: error.message,
    });
  }
} 