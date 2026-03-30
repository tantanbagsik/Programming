import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IMessage extends Document {
  _id: mongoose.Types.ObjectId
  conversation: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  content: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

MessageSchema.index({ conversation: 1, createdAt: -1 })
MessageSchema.index({ sender: 1 })

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
export default Message
