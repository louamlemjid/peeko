import dbConnect from "@/lib/mongoDB";
import { Animation, IAnimation } from "@/model/animation";

/**
 * Create a single Animation (.bin)
 */
export async function createAnimation(
  name: string,
  link: string,
  category: string,
  imageUrl:string
): Promise<IAnimation> {
  await dbConnect();

  try {
    const animation = await Animation.create({
      name,
      link,
      category,
      imageUrl
    });

    return JSON.parse(JSON.stringify(animation));
  } catch (error: unknown) {
    throw new Error("Failed to create animation: " + error);
  }
}

/**
 * Get all animations (dashboard)
 */
export async function getAnimations(category?: string) {
  await dbConnect();

  try {
    const query = category ? { category } : {};
    const animations = await Animation.find(query).lean();

    return JSON.parse(JSON.stringify(animations));
  } catch (error) {
    return [];
  }
}
export async function getCategories() {
  await dbConnect();

  try {
    const categories = await Animation.distinct("category");

    return categories.map((cat: string) => ({
      value: cat,
      label: cat
    }));
  } catch (error) {
    return [];
  }
}


/**
 * Get animation by ID
 */
export async function getAnimationById(id: string) {
  await dbConnect();

  try {
    const animation = await Animation.findById(id).lean();
    return animation ? JSON.parse(JSON.stringify(animation)) : null;
  } catch {
    return null;
  }
}

export async function updateAnimation(
  id: string,
  data: {
    name: string;
    link: string;
    category: string;
    imageUrl: string;
  }
): Promise<IAnimation | null> {
  await dbConnect();

  try {
    const animation = await Animation.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,          // return updated document
        runValidators: true // validate schema
      }
    );

    if (!animation) return null;

    return JSON.parse(JSON.stringify(animation));
  } catch (error: unknown) {
    throw new Error("Failed to update animation: " + error);
  }
}


/**
 * Delete animation
 */
export async function deleteAnimation(id: string) {
  await dbConnect();

  try {
    await Animation.findByIdAndDelete(id);
    return true;
  } catch (error) {
    throw new Error("Failed to delete animation: " + error);
  }
}
