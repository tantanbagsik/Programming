import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVideoCallSession extends Document {
  _id: mongoose.Types.ObjectId;
  callId: string; // Twilio Room SID or custom UUID
  initiatorId: mongoose.Types.ObjectId; // Admin/Instructor ID
  participantId: mongoose.Types.ObjectId; // Student ID
  courseId?: mongoose.Types.ObjectId; // Related course (optional)
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'missed' | 'rejected';
  startedAt?: Date;
  endedAt?: Date;
  durationSeconds?: number;
  recordingUrl?: string;
  metadata: Record<string, any>; // For additional data like network quality
  createdAt: Date;
  updatedAt: Date;
}

const VideoCallSessionSchema = new Schema<IVideoCallSession>({
  callId: { type: String, required: true, unique: true, index: true },
  initiatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participantId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
  status: { 
    type: String, 
    enum: ['initiated', 'ringing', 'in-progress', 'completed', 'missed', 'rejected'],
    default: 'initiated' 
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  durationSeconds: { type: Number },
  recordingUrl: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// Indexes for efficient querying
VideoCallSessionSchema.index({ initiatorId: 1, status: 1, createdAt: -1 });
VideoCallSessionSchema.index({ participantId: 1, status: 1, createdAt: -1 });
VideoCallSessionSchema.index({ courseId: 1 });

const VideoCallSession: Model<IVideoCallSession> = 
  mongoose.models.VideoCallSession || 
  mongoose.model<IVideoCallSession>('VideoCallSession', VideoCallSessionSchema);

export default VideoCallSession;