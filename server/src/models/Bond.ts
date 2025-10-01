import mongoose, { Document, Schema } from 'mongoose';

export interface IBond extends Document {
    name: string;
    bondNumber: string;
    state: string;
    amount: number;
    issuedDate: Date;
    expiresDate: Date;
    isActive: boolean;
    assignedTo: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    attachments?: string[];
    status?: 'pending' | 'approved' | 'rejected';
    submittedAt: Date;
    reviewedAt?: Date;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewNotes?: string;
    documentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const bondSchema = new Schema<IBond>({
    name: {
        type: String,
        required: true,
        trim: true
    },

    bondNumber: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    issuedDate: {
        type: Date,
        required: false
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

bondSchema.index({ assignedTo: 1, state: 1 });
bondSchema.index({ expiresDate: 1 });
bondSchema.index({ bondNumber: 1, state: 1 });

export default mongoose.model<IBond>('Bond', bondSchema); 