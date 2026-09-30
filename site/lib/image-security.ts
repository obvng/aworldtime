import sharp from "sharp";

const MAX_IMAGE_BYTES = 5_000_000;
const MAX_IMAGE_PIXELS = 40_000_000;
const MAX_IMAGE_DIMENSION = 12_000;

type SafeImageType = {
  extension: "jpg" | "png" | "webp";
  mimeType: "image/jpeg" | "image/png" | "image/webp";
};

export class ImageUploadError extends Error {
  constructor(
    public status: 413 | 415,
    message: string,
  ) {
    super(message);
    this.name = "ImageUploadError";
  }
}

function detectImageType(bytes: Uint8Array): SafeImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { extension: "jpg", mimeType: "image/jpeg" };
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { extension: "png", mimeType: "image/png" };
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { extension: "webp", mimeType: "image/webp" };
  }
  return null;
}

export async function sanitizeImageUpload(image: File) {
  if (image.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError(413, "The image must be smaller than 5 MB.");
  }

  const input = new Uint8Array(await image.arrayBuffer());
  const detected = detectImageType(input);
  if (!detected || image.type !== detected.mimeType) {
    throw new ImageUploadError(415, "The file content must be a valid PNG, JPEG, or WebP image.");
  }

  try {
    const decoder = sharp(input, {
      animated: false,
      failOn: "error",
      limitInputPixels: MAX_IMAGE_PIXELS,
      sequentialRead: true,
    });
    const metadata = await decoder.metadata();
    if (
      metadata.pages && metadata.pages > 1 ||
      !metadata.width ||
      !metadata.height ||
      metadata.width > MAX_IMAGE_DIMENSION ||
      metadata.height > MAX_IMAGE_DIMENSION ||
      metadata.width * metadata.height > MAX_IMAGE_PIXELS
    ) {
      throw new ImageUploadError(415, "Use a single-frame image no larger than 40 megapixels.");
    }

    const normalized = decoder.rotate();
    const output = detected.extension === "jpg"
      ? await normalized.jpeg({ quality: 88, mozjpeg: true }).toBuffer()
      : detected.extension === "png"
        ? await decoder.rotate().png({ compressionLevel: 9 }).toBuffer()
        : await normalized.webp({ quality: 88 }).toBuffer();

    return {
      body: new Blob([new Uint8Array(output)], { type: detected.mimeType }),
      extension: detected.extension,
      mimeType: detected.mimeType,
    };
  } catch (error) {
    if (error instanceof ImageUploadError) throw error;
    throw new ImageUploadError(415, "The uploaded file is not a safe, readable image.");
  }
}
