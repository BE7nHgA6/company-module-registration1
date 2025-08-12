// Cloudinary configuration and upload utilities
import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export class CloudinaryService {
  static async uploadImage(fileBuffer: Buffer, folder: string, publicId?: string): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: "image",
        quality: "auto",
        fetch_format: "auto",
      }

      if (publicId) {
        uploadOptions.public_id = publicId
        uploadOptions.overwrite = true
      }

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(error)
          } else if (result) {
            resolve({
              public_id: result.public_id,
              secure_url: result.secure_url,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type,
            })
          } else {
            reject(new Error("Upload failed"))
          }
        })
        .end(fileBuffer)
    })
  }

  static async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error)
      throw error
    }
  }

  static generateTransformationUrl(publicId: string, transformations: string): string {
    return cloudinary.url(publicId, {
      transformation: transformations,
    })
  }
}
