import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'accepted'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Application = mongoose.model('Application', applicationSchema);
