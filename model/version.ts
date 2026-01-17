import { Schema, model, models } from "mongoose";

export interface IVersion {
  _id: string;

  name: string;
  link: string;        // path or URL to .bin
  number:number;
  description:string;
  
  createdAt: Date;
  updatedAt: Date;
}

const versionSchema = new Schema<IVersion>(
  {
    name: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },

    number: {
      type: Number,
      required: true,
      unique:true
    },
    description:{
        type:String,
        required:false,
        default:""
    }
    
  },
  { timestamps: true }
);

export const Version =
  models.Version || model<IVersion>("Version", versionSchema);
