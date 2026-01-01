// src/server/uploadthing.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Example auth function
const auth = (req: Request) => {
  return { id: "fake-user-id" }; // Replace with real auth
};

export const uploadRouter = {
  binUploader: f(["blob"]) // accepts any file, including .bin
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => {
      console.log("Upload complete:", data);
      return { uploadedBy: data.metadata.id };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
