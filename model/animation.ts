import { Schema, model, models } from "mongoose";

export interface IAnimation {
  _id: string;

  name: string;
  link: string;        // path or URL to .bin
  category: string;    // idle | emotion | alert | custom
  imageUrl:string;

  createdAt: Date;
  updatedAt: Date;
}

const AnimationSchema = new Schema<IAnimation>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    link: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

      imageUrl:{
        type: String,
        required: true,
      }
    
  },
  { timestamps: true }
);

export const Animation =
  models.Animation || model<IAnimation>("Animation", AnimationSchema);
