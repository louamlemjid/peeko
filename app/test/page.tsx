// app/debug/drop-username-index/page.tsx

import dbConnect from "@/lib/mongoDB";
import { User } from "@/model/user";

export default function Page() {
  return (
    <form action={dropUnique}>
      <button type="submit">
        Drop username unique index
      </button>
    </form>
  );
}

// ✅ SERVER ACTION
export async function dropUnique() {
  "use server";

  try {
    await dbConnect();
    const dropped = await User.collection.dropIndex("username_1");
    console.log("Dropped index:", dropped);
  } catch (error) {
    console.error("Drop index error:", error);
  }
}
