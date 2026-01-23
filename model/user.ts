import mongoose, { Schema, model, models } from "mongoose";
import { IPeeko } from "./peeko";
import { IAnimationSet } from "./animationSet";

export interface IUser {
  _id: string;

  /* Clerk */
  clerkId: string;
  email?: string;
  username?: string;

  firstName:string;
  lastName:string;
  /* Verification code (generated in webhook service) */
  userCode?: string;

  /* Phone verification */
  phoneNumber?: string;
  phoneVerified: boolean;

  /* Presence */
  isOnline?: boolean;
  lastSeenAt?: Date;

  /* Social */
  friends: string[] | IUser[];
  sentPendingFriendRequests: string[] | IUser[];
  receivedPendingFriendRequests: string[] | IUser[];

  peeko:string | IPeeko;
  animationSets:string[] | IAnimationSet[];

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
    },
    firstName:{
      type:String,
      default:null
    },
    lastName:{
      type:String,
      default:null

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
      trim: true,
      default: undefined, // VERY IMPORTANT
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

    sentPendingFriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    receivedPendingFriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    
    peeko :{
      type:Schema.Types.ObjectId,
      ref:"Peeko",
      unique: true,
      sparse: true,
    },
    animationSets: [
      {
        type: Schema.Types.ObjectId,
        ref: "AnimationSet",
        default: [],
      },
    ]
  },
  {
    timestamps: true,
  }
);

export const User =
  models.User || model<IUser>("User", UserSchema);
