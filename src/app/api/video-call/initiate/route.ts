import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

// VideoCallSession model - we'll create it inline for now
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

    const user = session.user as any;
    const userId = user?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }

    const { participantId, courseId } = await request.json();

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
    }

    await connectDB();

    // Generate a unique call ID
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const roomName = `video_call_${callId}`;

    // Create a new video call session
    const videoCallSession = await VideoCallSession.create({
      callId,
      initiatorId: new mongoose.Types.ObjectId(userId),
      participantId: new mongoose.Types.ObjectId(participantId),
      courseId: courseId ? new mongoose.Types.ObjectId(courseId) : undefined,
      status: 'initiated'
    });

    return NextResponse.json({ 
      success: true,
      callId: videoCallSession.callId,
      roomName,
      message: 'Video call initiated successfully. Please use the token API to get access token.'
    });
  } catch (error) {
    console.error('Error initiating video call:', error);
    return NextResponse.json({ error: 'Failed to initiate video call' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const user = session.user as any;
    const userId = user?.id;

    // Get calls where user is initiator or participant
    const calls = await VideoCallSession.find({
      $or: [
        { initiatorId: new mongoose.Types.ObjectId(userId) },
        { participantId: new mongoose.Types.ObjectId(userId) }
      ]
    })
    .populate('initiatorId', 'name email')
    .populate('participantId', 'name email')
    .sort({ createdAt: -1 })
    .limit(50);

    return NextResponse.json({ calls });
  } catch (error) {
    console.error('Error fetching video calls:', error);
    return NextResponse.json({ error: 'Failed to fetch video calls' }, { status: 500 });
  }
}
