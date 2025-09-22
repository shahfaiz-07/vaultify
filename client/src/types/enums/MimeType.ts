export const MimeType = {
  IMAGE_JPEG: 'image/jpeg',
  IMAGE_PNG: 'image/png',
  IMAGE_GIF: 'image/gif',
  IMAGE_WEBP: 'image/webp',
  VIDEO_MP4: 'video/mp4',
  VIDEO_QUICKTIME: 'video/quicktime',
  VIDEO_WEBM: 'video/webm',
  APPLICATION_PDF: 'application/pdf',
  TEXT_PLAIN: 'text/plain',
} as const;

export type MimeType = typeof MimeType[keyof typeof MimeType];