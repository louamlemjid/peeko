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
  peekoCode?: string
): Promise<IAnimationSet> {
  await dbConnect();

  try {
    let peekoId = undefined;

    // Optional Peeko assignment
    if (peekoCode) {
      const peeko = await Peeko.findOne({ code: peekoCode });
      if (!peeko) throw new Error("Invalid Peeko code");
      peekoId = peeko._id;
    }

    const animationSet = await AnimationSet.create({
      name,
      category,
      animations,
      peekoCode,
      peeko: peekoId,
    });

    return JSON.parse(JSON.stringify(animationSet));
  } catch (error: unknown) {
    throw new Error("Failed to create animation set: " + error);
  }
}

/**
 * Get Animation Sets (dashboard or Peeko)
 */
export async function getAnimationSets(peekoCode?: string) {
  await dbConnect();

  try {
    const query = peekoCode
      ? { $or: [{ peekoCode }, { peekoCode: { $exists: false } }] }
      : {};

    const sets = await AnimationSet.find(query)
      .populate("animations", "name link category")
      .lean();

    return JSON.parse(JSON.stringify(sets));
  } catch {
    return [];
  }
}

/**
 * Get active Animation Set for a Peeko
 * (ESP32 endpoint)
 */
export async function getActiveAnimationSet(peekoCode: string) {
  await dbConnect();

  try {
    const set = await AnimationSet.findOne({
      peekoCode,
      isActive: true,
    })
      .populate("animations", "link")
      .lean();

    return set ? JSON.parse(JSON.stringify(set)) : null;
  } catch {
    return null;
  }
}

/**
 * Toggle Animation Set (activate / deactivate)
 */
export async function toggleAnimationSet(
  setId: string,
  isActive: boolean
) {
  await dbConnect();

  try {
    const set = await AnimationSet.findByIdAndUpdate(
      setId,
      { isActive },
      { new: true }
    ).lean();

    if (!set) throw new Error("Animation set not found");
    return set;
  } catch (error) {
    throw new Error("Failed to toggle animation set: " + error);
  }
}
