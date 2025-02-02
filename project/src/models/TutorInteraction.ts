import mongoose, { Schema, Document } from 'mongoose';

export interface ITutorInteraction extends Document {
  userId: mongoose.Types.ObjectId;
  question: string;
  response: string;
  createdAt: Date;
  updatedAt: Date;
}

const TutorInteractionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.TutorInteraction || mongoose.model<ITutorInteraction>('TutorInteraction', TutorInteractionSchema);