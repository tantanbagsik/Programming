import crypto from 'crypto'

const BBB_API_URL = process.env.BBB_API_URL || ''
const BBB_SECRET = process.env.BBB_SECRET || ''

function generateChecksum(apiCall: string, params: string): string {
  const hash = crypto.createHash('sha1')
  hash.update(apiCall + params + BBB_SECRET)
  return hash.digest('hex')
}

export async function createMeeting(meetingId: string, meetingName: string, moderatorPassword?: string) {
  if (!BBB_API_URL || !BBB_SECRET) {
    throw new Error('BigBlueButton credentials not configured')
  }

  const params = new URLSearchParams([
    ['meetingID', meetingId],
    ['name', meetingName],
    ['moderatorPW', moderatorPassword || 'mod' + Math.random().toString(36).substring(7)],
    ['attendeePW', 'attendee' + Math.random().toString(36).substring(7)],
    ['welcome', 'Welcome to the EduLearn session!'],
    ['record', 'false'],
  ])

  const checksum = generateChecksum('create', params.toString())
  const url = `${BBB_API_URL}/create?${params}&checksum=${checksum}`

  const response = await fetch(url)
  const xml = await response.text()
  
  if (xml.includes('<returncode>SUCCESS</returncode>')) {
    const getMeetingInfo = (key: string) => {
      const match = xml.match(`<${key}>(.*?)</${key}>`)
      return match ? match[1] : null
    }
    
    return {
      success: true,
      meetingId,
      internalMeetingId: getMeetingInfo('internalMeetingID'),
      moderatorPassword: getMeetingInfo('moderatorPW'),
      attendeePassword: getMeetingInfo('attendeePW'),
      joinUrl: null
    }
  }
  
  const message = xml.match(/<message>(.*?)<\/message>/)?.[1] || 'Failed to create meeting'
  throw new Error(message)
}

export async function getJoinUrl(meetingId: string, userName: string, role: 'moderator' | 'attendee' = 'attendee') {
  if (!BBB_API_URL || !BBB_SECRET) {
    throw new Error('BigBlueButton credentials not configured')
  }

  const meetingInfo = await getMeetingInfo(meetingId)
  if (!meetingInfo) {
    throw new Error('Meeting not found')
  }

  const password = role === 'moderator' 
    ? meetingInfo.moderatorPassword 
    : meetingInfo.attendeePassword

  const params = new URLSearchParams([
    ['meetingID', meetingId],
    ['fullName', userName],
    ['password', password || ''],
    ['role', role],
  ])

  const checksum = generateChecksum('join', params.toString())
  const url = `${BBB_API_URL}/join?${params}&checksum=${checksum}`

  return url
}

export async function getMeetingInfo(meetingId: string) {
  if (!BBB_API_URL || !BBB_SECRET) {
    return null
  }

  const params = new URLSearchParams([['meetingID', meetingId]])
  const checksum = generateChecksum('getMeetingInfo', params.toString())
  const url = `${BBB_API_URL}/getMeetingInfo?${params}&checksum=${checksum}`

  try {
    const response = await fetch(url)
    const xml = await response.text()
    
    if (!xml.includes('<returncode>SUCCESS</returncode>')) {
      return null
    }

    const getValue = (key: string) => {
      const match = xml.match(`<${key}>(.*?)</${key}>/`)
      return match ? match[1] : null
    }

    return {
      meetingId: xml.match(/<meetingID>(.*?)<\/meetingID>/)?.[1],
      internalMeetingId: xml.match(/<internalMeetingID>(.*?)<\/internalMeetingID>/)?.[1],
      moderatorPassword: xml.match(/<moderatorPW>(.*?)<\/moderatorPW>/)?.[1],
      attendeePassword: xml.match(/<attendeePW>(.*?)<\/attendeePW>/)?.[1],
      running: xml.includes('<running>true</running>'),
    }
  } catch {
    return null
  }
}

export async function endMeeting(meetingId: string, password: string) {
  if (!BBB_API_URL || !BBB_SECRET) {
    throw new Error('BigBlueButton credentials not configured')
  }

  const params = new URLSearchParams([
    ['meetingID', meetingId],
    ['password', password],
  ])

  const checksum = generateChecksum('end', params.toString())
  const url = `${BBB_API_URL}/end?${params}&checksum=${checksum}`

  const response = await fetch(url)
  const xml = await response.text()
  
  return xml.includes('<returncode>SUCCESS</returncode>')
}

export async function isMeetingRunning(meetingId: string) {
  if (!BBB_API_URL || !BBB_SECRET) {
    return false
  }

  const params = new URLSearchParams([['meetingID', meetingId]])
  const checksum = generateChecksum('isMeetingRunning', params.toString())
  const url = `${BBB_API_URL}/isMeetingRunning?${params}&checksum=${checksum}`

  try {
    const response = await fetch(url)
    const xml = await response.text()
    return xml.includes('<running>true</running>')
  } catch {
    return false
  }
}
