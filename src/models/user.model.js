import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['student', 'recruiter'],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [{ type: String }],
      resume: { type: String }, // Resume URL
      resumeOriginalName: { type: String },
      company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
      },
      profilePhoto: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
