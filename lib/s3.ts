import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: any, userId: string) {
  const fileName = `${userId}/${Date.now()}-${file.originalFilename}`;
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: fs.createReadStream(file.filepath),
    ContentType: file.mimetype,
  });

  try {
    await s3Client.send(command);
    return {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      key: fileName,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
} 