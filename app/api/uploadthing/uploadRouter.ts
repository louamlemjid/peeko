import type { FileRouter } from "uploadthing/next";
import { uploadRouter } from "./binUploader";
import { ourFileRouter } from "./core";

export const uploadGroup = {
  ...uploadRouter,
  ...ourFileRouter,
} satisfies FileRouter;

export type UploadGroup = typeof uploadGroup;
