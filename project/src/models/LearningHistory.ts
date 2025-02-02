import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningHistory extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  summary: string;
  resources: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const LearningHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    snippet: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default mongoose.models.LearningHistory || mongoose.model<ILearningHistory>('LearningHistory', LearningHistorySchema);