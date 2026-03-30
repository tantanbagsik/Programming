import mongoose from 'mongoose'

const MeetingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hostEmail: { type: String, required: true },
  hostName: { type: String, required: true },
  invitees: [{ type: String }],
  joinUrl: { type: String, required: true },
  roomId: { type: String, required: true },
}, { timestamps: true })

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', MeetingSchema)
export default Meeting