import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => {
  // Example auth, replace with real logic
  console.log(req)
  return { id: "fake-user-id" };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
  .middleware(async ({ req }) => {
    const user = await auth(req);
    if (!user) throw new UploadThingError("Unauthorized");
    return { userId: user.id };
  })
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("Upload complete for userId:", metadata.userId);
    console.log("File URL:", file.ufsUrl);
    return { uploadedBy: metadata.userId };
  }),
  
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
