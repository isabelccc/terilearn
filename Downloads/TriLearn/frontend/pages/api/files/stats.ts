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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get file usage statistics using MongoDB aggregation
    const stats = await prisma.$runCommandRaw({
      aggregate: 'File',
      pipeline: [
        { $match: { userId: { $oid: userId } } },
        { $group: {
            _id: "$type",
            count: { $sum: 1 },
            totalSize: { $sum: "$size" }
          }
        },
        { $sort: { count: -1 } }
      ],
      cursor: {}
    });

    return res.status(200).json({
      stats: stats.cursor.firstBatch,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return res.status(500).json({ 
      message: 'Error fetching file statistics',
      error: error.message,
    });
  }
} 