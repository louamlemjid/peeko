import dbConnect from "@/lib/mongoDB";
import { IVersion, Version } from "@/model/version";

/**
 * Create a single Version (.bin)
 */
export async function createVersion(
  name: string,
  link: string,
  description: string,
  number:number
): Promise<IVersion> {
  await dbConnect();

  try {
    const version = await Version.create({
      name,
      link,
      description,
      number
    });

    return JSON.parse(JSON.stringify(version));
  } catch (error: unknown) {
    throw new Error("Failed to create Version: " + error);
  }
}

/**
 * Get all Versions (dashboard)
 */
export async function getVersions() {
  await dbConnect();

  try {
    
    const versions = await Version.find().lean();

    return JSON.parse(JSON.stringify(versions));
  } catch (error) {
    return [];
  }
}

export async function getLatestVersion() {
  await dbConnect();

  try {
    
    const version =  await Version.findOne().sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(version));
  } catch (error) {
    return [];
  }
}

/**
 * Get Version by ID
 */
export async function getVersionById(id: string) {
  await dbConnect();

  try {
    const version = await Version.findById(id).lean();
    return version ? JSON.parse(JSON.stringify(version)) : null;
  } catch {
    return null;
  }
}

export async function updateVersion(
  id: string,
  data: {
    name: string;
    link: string;
    description: string;
    number: number;
  }
): Promise<IVersion | null> {
  await dbConnect();

  try {
    const version = await Version.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,          // return updated document
        runValidators: true // validate schema
      }
    );

    if (!version) return null;

    return JSON.parse(JSON.stringify(version));
  } catch (error: unknown) {
    throw new Error("Failed to update Version: " + error);
  }
}


/**
 * Delete Version
 */
export async function deleteVersion(id: string) {
  await dbConnect();

  try {
    await Version.findByIdAndDelete(id);
    return true;
  } catch (error) {
    throw new Error("Failed to delete Version: " + error);
  }
}
