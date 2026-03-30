import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const VideoCallSessionSchema = new mongoose.Schema({
  callId: { type: String, required: true, unique: true },
  initiatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  status: { 
    type: String, 
    enum: ['initiated', 'ringing', 'in-progress', 'completed', 'missed', 'rejected'],
    default: 'initiated' 
  },
  startedAt: { type: Date },
  endedAt: { type: Date },
  durationSeconds: { type: Number, default: 0 },
}, { timestamps: true });

const VideoCallSession = mongoose.models.VideoCallSession || mongoose.model('VideoCallSession', VideoCallSessionSchema);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { callId } = await request.json();

    if (!callId) {
      return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
    }

    await connectDB();

    // Find the call session
    const videoCallSession = await VideoCallSession.findOne({ callId });

    if (!videoCallSession) {
      return NextResponse.json({ error: 'Call session not found' }, { status: 404 });
    }

    // Update the call session
    const now = new Date();
    const startedAt = videoCallSession.startedAt || now;
    const durationSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);

    videoCallSession.status = 'completed';
    videoCallSession.endedAt = now;
    videoCallSession.durationSeconds = durationSeconds;

    await videoCallSession.save();

    return NextResponse.json({ 
      success: true,
      message: 'Call ended successfully',
      durationSeconds
    });
  } catch (error) {
    console.error('Error ending video call:', error);
    return NextResponse.json({ error: 'Failed to end video call' }, { status: 500 });
  }
}
