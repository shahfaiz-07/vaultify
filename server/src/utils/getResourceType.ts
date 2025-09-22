import { MimeType } from "../types/enums/MimeType.js";

export const getResourceType = (mimetype: MimeType): 'image' | 'video' | 'raw' => {
  if (mimetype.startsWith('image/') || mimetype.startsWith('application/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  return 'raw';  // text, etc.
};
