import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '../../../lib/prisma';
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

  const { id } = req.query;

  // Handle DELETE method (file deletion)
  if (req.method === 'DELETE') {
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

      // Delete file from filesystem if it exists
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete file record from database
      await prisma.file.delete({
        where: { id: id as string },
      });

      return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      return res.status(500).json({ 
        message: 'Error deleting file',
        error: error.message,
      });
    }
  }

  // Method not allowed for other request types
  return res.status(405).json({ message: 'Method not allowed' });
} 