import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceTemplate extends Document {
  category: string;
  template: string;
  variables: string[];
  description?: string;
  usageCount: number;
  status: 'active' | 'archived';
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceTemplateSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },
    template: {
      type: String,
      required: true
    },
    variables: [{
      type: String,
      required: true
    }],
    description: {
      type: String,
      trim: true
    },
    usageCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
ComplianceTemplateSchema.index({ category: 1 });
ComplianceTemplateSchema.index({ status: 1 });

export default mongoose.model<IComplianceTemplate>('ComplianceTemplate', ComplianceTemplateSchema);
