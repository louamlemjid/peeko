import dbConnect from "@/lib/mongoDB";
import { PictureSet, IPictureSet } from "@/model/pictureSet";
import { Peeko } from "@/model/peeko";
import "@/model/animation"; // 👈 force model registration


/**
 * Create an Animation Set
 */
export async function createPictureSet(
  name: string,
  category: string,
  animations: string[],
  paid:boolean,
  price:number
): Promise<IPictureSet> {
  await dbConnect();

  try {

    const pictureSet = await PictureSet.create({
      name,
      category,
      animations,
      paid,
      price
    });

    return JSON.parse(JSON.stringify(pictureSet));
  } catch (error: unknown) {
    throw new Error("Failed to create animation set: " + error);
  }
}

/**
 * Get Animation Sets (dashboard or Peeko)
 */
export async function getPictureSets() {
  await dbConnect();

  try {
    
    const sets = await PictureSet.find()
      .populate("animations", "name link category imageUrl")
      .lean();

    return JSON.parse(JSON.stringify(sets));
  } catch {
    return [];
  }
}



