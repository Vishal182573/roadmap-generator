import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Base interface for users
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'mentor';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Student specific interface
export interface IStudent extends IUser {
  studentId: string;
  enrolledCourses?: mongoose.Types.ObjectId[];
  mentors?: mongoose.Types.ObjectId[]; // References to mentors
}

// Mentor specific interface
export interface IMentor extends IUser {
  expertise: string[];
  qualifications: string[];
  institution: string;
  hourlyRate: number;
  rating: number;
  profileImage?: string;
  description: string;
  studentsmentored: number;
  students: mongoose.Types.ObjectId[]; // References to students
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['student', 'mentor'],
      default: 'student',
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'role',
  }
);

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Password comparison method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Student schema definition
const studentSchema = new Schema<IStudent>({
  studentId: {
    type: String,
    trim: true,
  },
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  mentors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Mentor schema definition
const mentorSchema = new Schema<IMentor>({
  expertise: [
    {
      type: String,
      required: true,
    },
  ],
  qualifications: [
    {
      type: String,
      required: true,
    },
  ],
  institution: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  profileImage: {
    type: String,
    default: '/api/placeholder/200/200',
  },
  description: {
    type: String,
    required: true,
  },
  studentsmentored: {
    type: Number,
    default: 0,
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Create or get the base User model
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

// Helper function to safely create discriminator models
function getOrCreateDiscriminator<T>(
  baseModel: mongoose.Model<any>,
  discriminatorName: string,
  schema: Schema<T>
): mongoose.Model<T> {
  // Check if the discriminator already exists
  if (mongoose.models[discriminatorName]) {
    return mongoose.models[discriminatorName] as mongoose.Model<T>;
  }
  
  // Check if it exists as a discriminator on the base model
  const existingDiscriminator = baseModel.discriminators?.[discriminatorName];
  if (existingDiscriminator) {
    return existingDiscriminator as mongoose.Model<T>;
  }
  
  // Create new discriminator
  return baseModel.discriminator<T>(discriminatorName, schema);
}

// Safely create Student and Mentor models
const Student = getOrCreateDiscriminator<IStudent>(User, 'Student', studentSchema);
const Mentor = getOrCreateDiscriminator<IMentor>(User, 'Mentor', mentorSchema);

export { Student, Mentor };
export default User;