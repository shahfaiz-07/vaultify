import { MimeType } from "../types";

export const getFileTypeLabel = (mimetype: MimeType): string => {
    if (mimetype.startsWith('image/')) return 'Image';
    if (mimetype.startsWith('video/')) return 'Video';
    if (mimetype === MimeType.APPLICATION_PDF) return 'PDF';
    if (mimetype === MimeType.TEXT_PLAIN) return 'Text';
    return 'File';
  };