import type { NextApiRequest, NextApiResponse } from 'next';
import { compare } from 'bcryptjs';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // If no user is found or password doesn't match, return false
    if (!user || !(await compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // User exists and password matches
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
} 