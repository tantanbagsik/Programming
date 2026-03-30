import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IConversation extends Document {
  _id: mongoose.Types.ObjectId
  participants: mongoose.Types.ObjectId[]
  lastMessage?: string
  lastMessageAt?: Date
  createdAt: Date
  updatedAt: Date
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
  },
  { timestamps: true }
)

ConversationSchema.index({ participants: 1 })
ConversationSchema.index({ lastMessageAt: -1 })

const Conversation: Model<IConversation> =
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema)
export default Conversation
