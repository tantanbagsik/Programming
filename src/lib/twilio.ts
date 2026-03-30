import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const apiKey = process.env.TWILIO_API_KEY || '';
const apiSecret = process.env.TWILIO_API_SECRET || '';

const isConfigured = accountSid && apiKey && apiSecret;

if (!isConfigured) {
  console.warn('Twilio credentials are not fully set. Video call functionality will not work.');
}

// Initialize Twilio client only if credentials are available
// @ts-ignore - Twilio client initialization
export const twilioClient = isConfigured ? twilio(accountSid, apiKey, apiSecret) : null;

// Function to generate an access token for Twilio Video
export function generateVideoToken(identity: string, roomName: string): string {
  if (!isConfigured) {
    throw new Error('Twilio credentials are not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_API_KEY, and TWILIO_API_SECRET environment variables.');
  }

  const AccessToken = (twilio as any).jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    accountSid,
    apiKey,
    apiSecret,
    { identity }
  );

  // Grant access to Video
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);

  // Serialize the token as a JWT
  return token.toJwt();
}

// Function to create a video room (if needed, though Twilio rooms are created on join)
export async function createRoom(roomName: string) {
  if (!twilioClient) {
    throw new Error('Twilio is not configured');
  }
  try {
    const room = await twilioClient.video.rooms.create({ uniqueName: roomName });
    return room;
  } catch (error) {
    console.error('Error creating Twilio room:', error);
    throw error;
  }
}

// Function to get a room by name
export async function getRoom(roomName: string) {
  if (!twilioClient) {
    throw new Error('Twilio is not configured');
  }
  try {
    const room = await twilioClient.video.rooms(roomName).fetch();
    return room;
  } catch (error) {
    console.error('Error fetching Twilio room:', error);
    throw error;
  }
}

// Function to end a room
export async function endRoom(roomName: string) {
  if (!twilioClient) {
    throw new Error('Twilio is not configured');
  }
  try {
    await twilioClient.video.rooms(roomName).update({ status: 'completed' });
  } catch (error) {
    console.error('Error ending Twilio room:', error);
    throw error;
  }
}
