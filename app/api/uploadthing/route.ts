import { createRouteHandler } from "uploadthing/next";
import { uploadGroup } from "./uploadRouter";
// import { ourFileRouter } from "./core";
// import { uploadRouter } from "./binUploader";
export const { GET, POST } = createRouteHandler({
  // router: ourFileRouter,
  router:uploadGroup,
});
