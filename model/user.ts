import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;

  /* Clerk */
  clerkId: string;
  email?: string;
  username: string;

  /* Verification code (generated in webhook service) */
  userCode?: string;

  /* Phone verification */
  phoneNumber: string;
  phoneVerified: boolean;

  /* Presence */
  isOnline: boolean;
  lastSeenAt?: Date;

  /* Social */
  friends: mongoose.Types.ObjectId[];
  pendingFriendRequests: mongoose.Types.ObjectId[];

  /* Timestamps */
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    /* ===== Clerk ===== */
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* ===== User Code (Peeko verification) ===== */
    userCode: {
      type: String,
      unique: true,
      sparse: true, // important for webhook generation
      index: true,
    },

    /* ===== Phone ===== */
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    phoneVerified: {
      type: Boolean,
      default: false,
    },

    /* ===== Presence ===== */
    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
    },

    /* ===== Social ===== */
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    pendingFriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User =
  models.User || model<IUser>("User", UserSchema);
