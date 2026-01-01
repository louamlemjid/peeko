import { Schema, model, models } from "mongoose";
import { IAnimation } from "./animation";
import { IPeeko } from "./peeko";

export interface IAnimationSet {
  _id: string;

  name: string;            // "Happy Pack", "Idle Pack"
  category: string;        // idle | emotion | custom
  animations: (string | IAnimation)[];

  peekoCode?: string;      // assign to specific Peeko
  peeko?: string | IPeeko;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const AnimationSetSchema = new Schema<IAnimationSet>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    animations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Animation",
        required: true,
      },
    ],

    peekoCode: {
      type: String,
      index: true,
    },

    peeko: {
      type: Schema.Types.ObjectId,
      ref: "Peeko",
      sparse: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const AnimationSet =
  models.AnimationSet || model<IAnimationSet>("AnimationSet", AnimationSetSchema);
