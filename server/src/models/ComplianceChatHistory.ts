import mongoose, { Schema, Document } from 'mongoose';

export interface IComplianceChatHistory extends Document {
  userId: mongoose.Types.ObjectId;
  state?: string;
  silo?: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    relatedRules?: mongoose.Types.ObjectId[];
  }>;
  sessionId: string;
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ComplianceChatHistorySchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    state: {
      type: String,
      uppercase: true,
      minlength: 2,
      maxlength: 2
    },
    silo: {
      type: String,
      enum: ['public_adjusting', 'construction', 'insurance_carrier', 'legal']
    },
    messages: [{
      role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
      },
      content: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      relatedRules: [{
        type: Schema.Types.ObjectId,
        ref: 'ComplianceRule'
      }]
    }],
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ComplianceChatHistorySchema.index({ userId: 1, createdAt: -1 });
ComplianceChatHistorySchema.index({ sessionId: 1 });
ComplianceChatHistorySchema.index({ state: 1, silo: 1 });
ComplianceChatHistorySchema.index({ status: 1 });

export default mongoose.model<IComplianceChatHistory>('ComplianceChatHistory', ComplianceChatHistorySchema);
