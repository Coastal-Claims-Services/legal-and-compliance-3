import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceRule extends Document {
  ruleId: string;
  state: string; // Two-letter state code (e.g., 'FL', 'TX')
  silo: 'public_adjusting' | 'construction' | 'insurance_carrier' | 'legal';
  authority: 'REG' | 'STATUTE' | 'CASE' | 'ADVISORY';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  subcategory?: string;
  ruleText: string;
  description?: string;
  sources: string[];
  leveragePoints?: string[];
  version: string;
  lastUpdated: Date;
  sunsetDate?: Date;
  tests?: any;
  testsCount: number;
  status: 'active' | 'pending' | 'archived';
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceRuleSchema: Schema = new Schema(
  {
    ruleId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      // Format: XX-CATEGORY-SUBCATEGORY-###
      match: /^[A-Z]{2}-[A-Z]+-[A-Z]+-\d{3}$/
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
    authority: {
      type: String,
      required: true,
      enum: ['REG', 'STATUTE', 'CASE', 'ADVISORY']
    },
    confidence: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    subcategory: {
      type: String,
      trim: true
    },
    ruleText: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    sources: [{
      type: String,
      required: true
    }],
    leveragePoints: [{
      type: String
    }],
    version: {
      type: String,
      required: true,
      default: '1.0.0'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    sunsetDate: {
      type: Date
    },
    tests: {
      type: Schema.Types.Mixed
    },
    testsCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'archived'],
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

// Indexes for efficient queries
ComplianceRuleSchema.index({ state: 1, silo: 1 });
ComplianceRuleSchema.index({ ruleId: 1 });
ComplianceRuleSchema.index({ category: 1 });
ComplianceRuleSchema.index({ confidence: 1 });
ComplianceRuleSchema.index({ status: 1 });
ComplianceRuleSchema.index({ sunsetDate: 1 });

export default mongoose.model<IComplianceRule>('ComplianceRule', ComplianceRuleSchema);
