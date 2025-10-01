import mongoose, { Document, Schema } from 'mongoose';

export interface ILicense extends Document {
    name: string;
    type: string;
    licenseNumber: string;
    state: string;
    issuedDate: Date;
    expiresDate: Date;
    isActive: boolean;
    assignedTo: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    attachments?: string[];
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewNotes?: string;
    documentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const licenseSchema = new Schema<ILicense>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: false,
        trim: true
    },
    licenseNumber: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    issuedDate: {
        type: Date,
        required: true
    },
    expiresDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachments: [String],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: false // Will be set explicitly in routes
    },
    submittedAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    reviewedAt: {
        type: Date,
        required: false
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    reviewNotes: {
        type: String,
        required: false
    },
    documentUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

licenseSchema.index({ assignedTo: 1, state: 1 });
licenseSchema.index({ expiresDate: 1 });
licenseSchema.index({ licenseNumber: 1, state: 1 });

export default mongoose.model<ILicense>('License', licenseSchema); 