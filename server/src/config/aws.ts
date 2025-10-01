import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

// Check for required environment variables
if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.PROFILE_PIC_S3_BUCKET_NAME) {
    console.error('Missing required AWS environment variables:');
    console.error('AWS_ACCESS_KEY:', process.env.AWS_ACCESS_KEY ? 'Set' : 'Missing');
    console.error('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Missing');
    console.error('PROFILE_PIC_S3_BUCKET_NAME:', process.env.PROFILE_PIC_S3_BUCKET_NAME ? 'Set' : 'Missing');
    throw new Error('Required AWS environment variables are missing');
}

// Configure AWS S3 Client (v3)
const s3 = new S3Client({
    region: 'us-west-1', // Updated to match bucket region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Configure multer for S3 uploads
export const uploadToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.PROFILE_PIC_S3_BUCKET_NAME!,
        key: function (req: any, file: Express.Multer.File, cb: any) {
            // Generate unique filename with timestamp
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.originalname.split('.').pop();
            cb(null, `profile-pictures/${uniqueName}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// NEW: Configure multer for document uploads (PDF, Word, Excel)
export const uploadDocumentToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.PROFILE_PIC_S3_BUCKET_NAME!,
        key: function (req: any, file: Express.Multer.File, cb: any) {
            const ext = file.originalname.split('.').pop();
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
            cb(null, `documents/${uniqueName}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

// NEW: Configure multer for course image uploads
export const uploadCourseImageToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.PROFILE_PIC_S3_BUCKET_NAME!,
        key: function (req: any, file: Express.Multer.File, cb: any) {
            const ext = file.originalname.split('.').pop();
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
            cb(null, `course-images/${uniqueName}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// NEW: Configure multer for course video uploads
export const uploadCourseVideoToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.PROFILE_PIC_S3_BUCKET_NAME!,
        key: function (req: any, file: Express.Multer.File, cb: any) {
            const ext = file.originalname.split('.').pop();
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
            cb(null, `course-videos/${uniqueName}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        // Only allow video files
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB limit for videos
    }
});

// Function to delete file from S3
export const deleteFromS3 = async (key: string): Promise<void> => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.PROFILE_PIC_S3_BUCKET_NAME!,
            Key: key
        });
        await s3.send(command);
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        throw error;
    }
};

// NEW: Configure multer for message file uploads (any file type)
export const uploadMessageFileToS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.PROFILE_PIC_S3_BUCKET_NAME!,
        key: function (req: any, file: Express.Multer.File, cb: any) {
            const ext = file.originalname.split('.').pop();
            const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + ext;
            cb(null, `message-files/${uniqueName}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
        // Allow most common file types
        const allowedTypes = [
            // Images
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
            // Documents
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            // Text files
            'text/plain', 'text/csv',
            // Archives
            'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
            // Audio/Video
            'audio/mpeg', 'audio/wav', 'video/mp4', 'video/avi', 'video/quicktime'
        ];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type ${file.mimetype} not allowed`), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    }
});

export { s3 }; 