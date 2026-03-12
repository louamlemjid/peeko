import { NextRequest, NextResponse } from "next/server";
import { getPeekoByCode } from "@/service/peeko";


const BASE_URL = "https://api.assemblyai.com/v2";

interface Params {
  params: Promise<{
    peekoCode: string;
  }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { peekoCode } = await params;

    // 1. Validate Peeko exists first
    const peeko = await getPeekoByCode(peekoCode);
    if (!peeko) {
      return NextResponse.json({ success: false, error: "Peeko not found" }, { status: 404 });
    }

    // 2. Extract the file from the request FormData
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const authHeader = { "Authorization": process.env.ASSEMBLY_API_KEY! };

    // 3. Upload the file to AssemblyAI
    // We send the file as a buffer/binary stream
    const uploadResponse = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/octet-stream" },
      body: Buffer.from(await file.arrayBuffer()),
    });

    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok) throw new Error("Failed to upload file to AssemblyAI");

    const audioUrl = uploadData.upload_url;

    // 4. Start the Transcription
    const transcriptResponse = await fetch(`${BASE_URL}/transcript`, {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_detection: true,
        speech_models: ["universal-3-pro", "universal-2"],
      }),
    });

    const transcriptData = await transcriptResponse.json();
    if (!transcriptResponse.ok) throw new Error(transcriptData.error);

    const transcriptId = transcriptData.id;
    const pollingUrl = `${BASE_URL}/transcript/${transcriptId}`;

    // 5. Polling Loop
    let finalResult;
    while (true) {
      const pollingResponse = await fetch(pollingUrl, { headers: authHeader });
      const result = await pollingResponse.json();

      if (result.status === "completed") {
        finalResult = result;
        break;
      } else if (result.status === "error") {
        throw new Error(`Transcription error: ${result.error}`);
      }

      // Wait 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return NextResponse.json({
      success: true,
      peekoCode,
      text: finalResult.text,
      confidence: finalResult.confidence,
    });

  } catch (error: any) {
    console.error("Transcription Route Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}