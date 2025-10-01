import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceAlert extends Document {
  alertId: string;
  state: string;
  silo: 'public_adjusting' | 'construction' | 'insurance_carrier' | 'legal';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  category: string;
  relatedRules?: mongoose.Types.ObjectId[];
  status: 'pending' | 'resolved' | 'dismissed';
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceAlertSchema: Schema = new Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true
    },
    state: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    silo: {
      type: String,
      required: true,
      enum: ['public_adjusting', 'construction', 'insurance_carrier', 'legal']
    },
    confidence: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW']
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    relatedRules: [{
      type: Schema.Types.ObjectId,
      ref: 'ComplianceRule'
    }],
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending'
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    },
    notes: {
      type: String
    },
    createdBy: {
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
ComplianceAlertSchema.index({ state: 1, status: 1 });
ComplianceAlertSchema.index({ alertId: 1 });
ComplianceAlertSchema.index({ status: 1 });
ComplianceAlertSchema.index({ silo: 1 });

export default mongoose.model<IComplianceAlert>('ComplianceAlert', ComplianceAlertSchema);
