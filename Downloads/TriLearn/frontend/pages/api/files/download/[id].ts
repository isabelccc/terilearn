import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { prisma } from '../../../../lib/prisma';
import fs from 'fs';
import path from 'path';

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

  const { id } = req.query;

  try {
    // Find the file in the database
    const file = await prisma.file.findUnique({
      where: { id: id as string },
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if the file belongs to the current user
    if (file.userId !== session.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get the file path
    const filePath = path.join(process.cwd(), file.path);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    // Set content type and headers
    res.setHeader('Content-Type', file.type);
    res.setHeader('Content-Disposition', `inline; filename="${file.name}"`);
    
    // Send the file
    return res.send(fileBuffer);
  } catch (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ 
      message: 'Error downloading file',
      error: error.message,
    });
  }
} 