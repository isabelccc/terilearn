import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '../../lib/prisma';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { getMaxFilesByPlanName } from '../../lib/plans';

// Disable Next.js's default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get user's current plan and file count
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { planType: true, filesUploaded: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get the maximum files allowed for the user's plan
    const maxFiles = getMaxFilesByPlanName(user.planType as any);
    
    // Check if user has reached their upload limit
    if (user.filesUploaded >= maxFiles) {
      return res.status(403).json({ 
        message: 'File upload limit reached',
        code: 'PLAN_LIMIT_REACHED',
        currentPlan: user.planType,
        maxFiles,
        filesUploaded: user.filesUploaded
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Configure formidable
    const form = new formidable.IncomingForm({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024, // 100MB limit
    });

    // Parse the form
    const [fields, files]: [formidable.Fields, formidable.Files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const uploadedFiles = [];

    // Process each file
    for (const key in files) {
      const file = files[key];
      
      // Handle multiple files
      const fileArray = Array.isArray(file) ? file : [file];
      
      for (const f of fileArray) {
        // Create a unique filename
        const fileName = f.originalFilename || 'unnamed-file';
        const fileExt = path.extname(fileName);
        const baseName = path.basename(fileName, fileExt);
        const timestamp = Date.now();
        const newFileName = `${baseName}-${timestamp}${fileExt}`;
        
        // Get the uploaded file's temporary path
        const oldPath = f.filepath;
        
        // Create the new path
        const newPath = path.join(uploadsDir, newFileName);
        
        // Move the file to its permanent location
        fs.renameSync(oldPath, newPath);
        
        // Get file size
        const stats = fs.statSync(newPath);
        
        // Create database record
        const fileRecord = await prisma.file.create({
          data: {
            name: fileName,
            path: newPath.replace(process.cwd(), ''),  // Store relative path
            type: f.mimetype || 'application/octet-stream',
            size: stats.size,
            userId: session.user.id,
            description: fields.description ? String(fields.description) : '',
          },
        });
        
        uploadedFiles.push(fileRecord);
      }
    }

    // After successful file upload, increment the user's filesUploaded count
    await prisma.user.update({
      where: { id: userId },
      data: { filesUploaded: { increment: uploadedFiles.length } }
    });

    return res.status(200).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      message: 'Error uploading files',
      error: error.message,
    });
  }
} 