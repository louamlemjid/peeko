
// src/models/peeko.model.ts

import  { Schema,  model, models } from "mongoose";
import { IUser } from "./user";
import { IAnimationSet } from "./animationSet";
export enum PeekoMood {
  HAPPY = "HAPPY",
  ANGRY = "ANGRY",
  TIRED = "TIRED",
  DEFAULT = "DEFAULT",
}


export interface IPeeko {
  _id: string;
  code: string;           // userCode coming from Clerk flow
  peekoName?: string;     // optional, user can rename later
  mood: PeekoMood;
  user: string | IUser;
  animationSet?: string | IAnimationSet;
  createdAt: Date;        // timestamp
  updatedAt:Date;
}


const PeekoSchema = new Schema<IPeeko>(
  {
    code: {
      type: String,
      required: true,
      unique: true,     
      index: true,
    },

    peekoName: {
      type: String,
      trim: true,
    },

    mood: {
      type: String,
      enum: Object.values(PeekoMood),
      default: PeekoMood.DEFAULT,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    
    animationSet: {
      type: Schema.Types.ObjectId,
      ref: "AnimationSet",
      
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }, 
  }
);

export const Peeko =
  models.Peeko || model<IPeeko>("Peeko", PeekoSchema);
