export type MimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/gif'
  | 'image/webp'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/webm'
  | 'application/pdf'
  | 'text/plain';

export const MimeType = {
  IMAGE_JPEG: 'image/jpeg' as MimeType,
  IMAGE_PNG: 'image/png' as MimeType,
  IMAGE_GIF: 'image/gif' as MimeType,
  IMAGE_WEBP: 'image/webp' as MimeType,
  VIDEO_MP4: 'video/mp4' as MimeType,
  VIDEO_QUICKTIME: 'video/quicktime' as MimeType,
  VIDEO_WEBM: 'video/webm' as MimeType,
  APPLICATION_PDF: 'application/pdf' as MimeType,
  TEXT_PLAIN: 'text/plain' as MimeType,
};