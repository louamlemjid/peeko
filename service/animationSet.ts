import dbConnect from "@/lib/mongoDB";
import { AnimationSet, IAnimationSet } from "@/model/animationSet";
import { Peeko } from "@/model/peeko";

/**
 * Create an Animation Set
 */
export async function createAnimationSet(
  name: string,
  category: string,
  animations: string[],
  paid:boolean,
  price:number
): Promise<IAnimationSet> {
  await dbConnect();

  try {

    const animationSet = await AnimationSet.create({
      name,
      category,
      animations,
      paid,
      price
    });

    return JSON.parse(JSON.stringify(animationSet));
  } catch (error: unknown) {
    throw new Error("Failed to create animation set: " + error);
  }
}

/**
 * Get Animation Sets (dashboard or Peeko)
 */
export async function getAnimationSets() {
  await dbConnect();

  try {
    
    const sets = await AnimationSet.find()
      .populate("animations", "name link category imageUrl")
      .lean();

    return JSON.parse(JSON.stringify(sets));
  } catch {
    return [];
  }
}



