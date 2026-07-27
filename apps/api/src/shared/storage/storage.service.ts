import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}

@Injectable()
export class StorageService {
  constructor() {
    if (!process.env.CLOUDINARY_URL) {
      cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }
  }

  /**
   * Generate a signed upload signature for direct browser uploads.
   * The client uses this to upload directly to Cloudinary without routing through our server.
   */
  generateUploadSignature(folder = 'submissions'): {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
    folder: string;
    transformation: string;
  } {
    console.log(`[StorageService] Generating signature for folder: ${folder}`);
    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder, transformation: 'c_limit,w_2000,h_2000' };
    const config = cloudinary.v2.config();
    
    console.log('[StorageService] Signing with params:', params);
    if (!config.api_secret) {
      console.warn('[StorageService] WARNING: Cloudinary api_secret is missing or empty!');
    }
    
    const signature = cloudinary.v2.utils.api_sign_request(
      params,
      config.api_secret || '',
    );
    
    const result = {
      signature,
      timestamp,
      cloudName: config.cloud_name || '',
      apiKey: config.api_key || '',
      folder,
      transformation: params.transformation,
    };
    
    console.log('[StorageService] Generated signature result:', { ...result, signature: '***' });
    return result;
  }

  /**
   * Get delivery URL for a stored image (with optional transforms).
   */
  getImageUrl(publicId: string, options?: cloudinary.TransformationOptions): string {
    return cloudinary.v2.url(publicId, {
      secure: true,
      ...(options as Record<string, unknown>),
    });
  }

  /**
   * Get thumbnail URL (200x200 cropped).
   */
  getThumbnailUrl(publicId: string): string {
    return this.getImageUrl(publicId, {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });
  }

  /**
   * Delete an image by public ID.
   */
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.v2.uploader.destroy(publicId);
  }
}
