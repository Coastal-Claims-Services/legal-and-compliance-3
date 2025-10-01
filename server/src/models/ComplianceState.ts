import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceState extends Document {
  stateCode: string;
  stateName: string;
  status: 'active' | 'prohibited' | 'pending' | 'research';
  paLicenseRequired: boolean;
  licenseInfo?: {
    applicationFee?: number;
    renewalFee?: number;
    bondAmount?: number;
    ceRequirements?: string;
    examRequired?: boolean;
  };
  notes?: string;
  lastReviewDate: Date;
  nextReviewDate?: Date;
  rulesCount?: number;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceStateSchema: Schema = new Schema(
  {
    stateCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    stateName: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'prohibited', 'pending', 'research'],
      default: 'research'
    },
    paLicenseRequired: {
      type: Boolean,
      required: true,
      default: true
    },
    licenseInfo: {
      applicationFee: { type: Number },
      renewalFee: { type: Number },
      bondAmount: { type: Number },
      ceRequirements: { type: String },
      examRequired: { type: Boolean }
    },
    notes: {
      type: String
    },
    lastReviewDate: {
      type: Date,
      default: Date.now
    },
    nextReviewDate: {
      type: Date
    },
    rulesCount: {
      type: Number,
      default: 0
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ComplianceStateSchema.index({ stateCode: 1 });
ComplianceStateSchema.index({ status: 1 });
ComplianceStateSchema.index({ stateName: 1 });

export default mongoose.model<IComplianceState>('ComplianceState', ComplianceStateSchema);
