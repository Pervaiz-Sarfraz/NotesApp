import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

export async function uploadFileToR2(fileBuffer, key, contentType) {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    },
  });

  return await upload.done();
}

export const getPublicUrl = (filePath) => {
    const baseUrl = process.env.R2_PUBLIC_BASE_URL; // e.g., https://pub-xxx.r2.dev/media_resources
    const relativePath = filePath.replace(/^media_resources\//, ""); // remove directory prefix
  
    return `${baseUrl}/${relativePath}`;
  };