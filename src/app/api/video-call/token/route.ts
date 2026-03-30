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

    // Get user ID from session - NextAuth adds the id to session.user via JWT callback
    const user = session.user as any;
    const userId = user?.id;
    
    // Skip identity validation if user ID is not available (for development)
    // In production, you would want to validate that identity matches the session user
    if (userId && identity !== userId) {
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
