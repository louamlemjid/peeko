import { Schema, model, models, Document, Types } from 'mongoose';
import { IUser } from './user';

export type MessageSourceType = 'USER' | 'ADMIN' | 'SYSTEM';

export interface IMessage  {
  _id: string;

  destination: string; // userCode
  userDestination:string | IUser;

  source: string;      
  userSource:string | IUser;
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
    userDestination:{
      type: Types.ObjectId,
      ref:"User",
    },

    source: {
      type: String,
      required: true,
      index: true,
    },
    userSource:{
      type:Types.ObjectId,
      ref:"User"
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
