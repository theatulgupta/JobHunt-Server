import mongoose, { Schema } from 'mongoose';

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
      },
    ],
    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    openings: {
      type: Number,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
  },
  { timestamps: true },
);

export const Job = mongoose.model('Job', jobSchema);
