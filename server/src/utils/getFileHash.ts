import fs from 'fs';
import crypto from 'crypto';
export const getFileHash = (fileLocalPath: string): string => {
    const fileBuffer = fs.readFileSync(fileLocalPath);
    
    return crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');
}