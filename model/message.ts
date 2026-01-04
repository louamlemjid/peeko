import { Schema, model, models, Document } from 'mongoose';

export type MessageSourceType = 'USER' | 'ADMIN' | 'SYSTEM';

export interface IMessage  {
  _id: string;

  destination: string; // userCode
  source: string;      

  sourceType: MessageSourceType;

  opened: boolean;

  content: string;

  meta?: Record<string, any>;

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    destination: {
      type: String,
      required: true,
      index: true,
    },

    source: {
      type: String,
      required: true,
      index: true,
    },

    sourceType: {
      type: String,
      enum: ['USER', 'ADMIN', 'SYSTEM'],
      default: 'USER',
    },

    opened: {
      type: Boolean,
      default: false,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Message =
  models.Message || model<IMessage>('Message', MessageSchema);
