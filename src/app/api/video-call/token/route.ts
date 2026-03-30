import { NextRequest, NextResponse } from 'next/server';
import { generateVideoToken } from '@/lib/twilio';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { identity, roomName } = await request.json();

    if (!identity || !roomName) {
      return NextResponse.json(
        { error: 'Identity and roomName are required' },
        { status: 400 }
      );
    }

    // In a real app, you might want to validate that the identity matches the session user
    // or that the user is allowed to create a call with the given identity.
    // For simplicity, we'll use the session user's ID as the identity.
    // But note: the client is sending identity, so we should check it matches the session.
    if (!session.user || identity !== session.user.id) {
      return NextResponse.json(
        { error: 'Identity does not match the current user' },
        { status: 403 }
      );
    }

    const token = generateVideoToken(identity, roomName);
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating video token:', error);
    return NextResponse.json(
      { error: 'Failed to generate video token' },
      { status: 500 }
    );
  }
}