import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  score?: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema = new Schema({
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
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    }
  }],
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.models.Quiz || mongoose.model<IQuiz>('Quiz', QuizSchema);