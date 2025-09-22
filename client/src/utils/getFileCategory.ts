import type { FilterType } from "../components/Dashboard/PublicFiles";
import { MimeType } from "../types";

export const getFileCategory = (mimetype: MimeType): FilterType => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype === MimeType.APPLICATION_PDF || mimetype === MimeType.TEXT_PLAIN) return 'document';
    return 'other';
  };