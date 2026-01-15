import { Schema, model, models } from "mongoose";
import { IAnimation } from "./animation";
import { IPeeko } from "./peeko";

export interface IPictureSet {
  _id: string;

  name: string;            // "Happy Pack", "Idle Pack"
  category: string;        // idle | emotion | custom
  animations: (string | IAnimation)[];

  paid:boolean;
  price:number;
  
  createdAt: Date;
  updatedAt: Date;
}

const pictureSetSchema = new Schema<IPictureSet>(
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

    paid:{
      type:Boolean,
      default:false
    },

    price: { 
      type: Number,
      default: 0 },

  },
  { timestamps: true }
);

export const PictureSet =
  models.PictureSet || model<IPictureSet>("PictureSet", pictureSetSchema);
