import fs from 'fs/promises';
import path from 'path';

interface UploadResult {
  url: string;
  key: string;
}

export class StorageService {
  /**
   * Upload a PDF file
   */
  static async uploadPDF(
    file: Buffer,
    filename: string,
    userId: string
  ): Promise<UploadResult> {
    const storageType = process.env.STORAGE_TYPE || 'local';

    if (storageType === 's3') {
      return this.uploadToS3(file, filename, userId);
    } else {
      return this.uploadToLocal(file, filename, userId);
    }
  }

  /**
   * Delete a PDF file
   */
  static async deletePDF(key: string): Promise<void> {
    const storageType = process.env.STORAGE_TYPE || 'local';

    if (storageType === 's3') {
      return this.deleteFromS3(key);
    } else {
      return this.deleteFromLocal(key);
    }
  }

  /**
   * Upload to AWS S3
   */
  private static async uploadToS3(
    file: Buffer,
    filename: string,
    userId: string
  ): Promise<UploadResult> {
    // TODO: Implement AWS S3 upload when credentials are configured
    // For now, throw error to indicate S3 is not configured
    throw new Error('AWS S3 no está configurado. Usa STORAGE_TYPE=local en desarrollo.');

    // Example implementation:
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   region: process.env.AWS_REGION,
    // });
    //
    // const key = `users/${userId}/books/${Date.now()}-${filename}`;
    // await s3.putObject({
    //   Bucket: process.env.S3_BUCKET!,
    //   Key: key,
    //   Body: file,
    //   ContentType: 'application/pdf',
    // }).promise();
    //
    // const url = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`;
    // return { url, key };
  }

  /**
   * Delete from AWS S3
   */
  private static async deleteFromS3(key: string): Promise<void> {
    // TODO: Implement AWS S3 delete when credentials are configured
    throw new Error('AWS S3 no está configurado. Usa STORAGE_TYPE=local en desarrollo.');

    // Example implementation:
    // const AWS = require('aws-sdk');
    // const s3 = new AWS.S3({
    //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //   region: process.env.AWS_REGION,
    // });
    //
    // await s3.deleteObject({
    //   Bucket: process.env.S3_BUCKET!,
    //   Key: key,
    // }).promise();
  }

  /**
   * Upload to local filesystem
   */
  private static async uploadToLocal(
    file: Buffer,
    filename: string,
    userId: string
  ): Promise<UploadResult> {
    const key = `users/${userId}/books/${Date.now()}-${filename}`;
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filepath = path.join(uploadsDir, key);

    // Create directory if it doesn't exist
    await fs.mkdir(path.dirname(filepath), { recursive: true });

    // Write file
    await fs.writeFile(filepath, file);

    // Generate full URL for local development
    const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3001';
    const url = `${baseUrl}/uploads/${key}`;
    
    return { url, key };
  }

  /**
   * Delete from local filesystem
   */
  private static async deleteFromLocal(key: string): Promise<void> {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const filepath = path.join(uploadsDir, key);

    try {
      await fs.unlink(filepath);
    } catch (error) {
      // File might not exist, ignore error
      console.warn(`Failed to delete file: ${filepath}`, error);
    }
  }

  /**
   * Validate PDF file
   */
  static validatePDF(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file type
    if (file.mimetype !== 'application/pdf') {
      return { valid: false, error: 'El archivo debe ser un PDF' };
    }

    // Check file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return { valid: false, error: 'El archivo no debe exceder 50MB' };
    }

    return { valid: true };
  }
}
