import mongoose from 'mongoose';

const meetSchema = new mongoose.Schema({
  meetId: {
    type: String,
    required: true,
    unique: true,
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledTime: {
    type: Date,
    // required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    // required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
  },
  topic: {
    type: String,
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for querying meets by mentor and time
meetSchema.index({ mentorId: 1, scheduledTime: 1 });

const Meet = mongoose.models.Meet || mongoose.model('Meet', meetSchema);

export default Meet; 