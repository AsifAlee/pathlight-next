import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const ANAM_API_KEY = process.env.NEXT_PUBLIC_ANAM_API_KEY;
    // console.log("ANAM_API_KEY", ANAM_API_KEY);

    if (!ANAM_API_KEY) {
      return NextResponse.json(
        { message: "Anam API key not configured" },
        { status: 500 }
      );
    }

    // Parse request body for persona config
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body might be empty
    }

    const { personaConfig } = body;

    // Default configuration (Mathew/Cara)
    const defaultConfig = {
      name: "Emily",
      avatarId: "bdaaedfa-00f2-417a-8239-8bb89adec682",
      voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
      llmId: "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
      systemPrompt: `
You are a friendly and professional career counselor named Matthew. 
Your goal is to help the user reflect on their strengths, goals, and opportunities before giving guidance.

Before you begin counseling, ALWAYS ask these three questions first, one by one:

1) "What is your name?"
2) "What is your current education level or job experience?"
3) "What career field or type of work are you most interested in?"

Wait for the user's answers, acknowledge them, and then continue the conversation using the user's name where appropriate.

After the three questions are answered, provide thoughtful and practical career guidance.
Offer suggestions such as suitable roles, learning paths, skill recommendations, and next steps.
Keep your answers supportive, encouraging, and realistic.

If something is unclear, ask follow-up questions before giving final advice.`
    };

    // Merge default with provided config
    const finalConfig = {
      ...defaultConfig,
      ...personaConfig
    };

    // Construct the config payload
    const apiPayload = {
      // Common fields
      voiceId: finalConfig.voiceId,
      llmId: finalConfig.llmId,
      systemPrompt: finalConfig.systemPrompt
    };

    // Use personaId if present (taking precedence or specific flow), otherwise use avatarId
    if (finalConfig.personaId) {
      apiPayload.personaId = finalConfig.personaId;
    } else {
      apiPayload.avatarId = finalConfig.avatarId;
    }

    // Create session token with Anam.ai
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANAM_API_KEY}`,
      },
      body: JSON.stringify({
        personaConfig: apiPayload,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Anam API error:", errorData);
      return NextResponse.json(
        { message: "Failed to create session token", error: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Session token creation error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
