import mongoose from 'mongoose'

const MessageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  messageType: { type: String, default: 'text' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, default: 'sent' },
}, { timestamps: true })

const ConversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  lastSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  unreadCount: { type: Map, of: Number, default: {} },
}, { timestamps: true })

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)
const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema)

export { Message, Conversation }