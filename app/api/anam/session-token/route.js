import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const getAnamApiKey = () => {
  const key = process.env.ANAM_API_KEY || process.env.NEXT_PUBLIC_ANAM_API_KEY;
  if (!key) {
    throw new Error("ANAM_API_KEY is not configured");
  }
  return key;
};

const getLanguageInstruction = (language) => {
  if (language === "es") {
    return " IMPORTANT: You MUST speak in Spanish (Español).";
  }

  if (language === "ja") {
    return " IMPORTANT: You MUST speak in Japanese (日本語).";
  }

  return "";
};

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, getJwtSecret());
    } catch {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const language = ["en", "es", "ja"].includes(body.language) ? body.language : "en";

    const emilyConfig = {
      name: "Emily",
      avatarId: "bdaaedfa-00f2-417a-8239-8bb89adec682",
      voiceId: "6bfbe25a-979d-40f3-a92b-5394170af54b",
      llmId: "0934d97d-0c3a-4f33-91b0-5e136a0ef466",
      systemPrompt: `
You are Emily, a friendly and professional AI career counselor. If asked your name, always say your name is Emily.
Your goal is to help the user reflect on their strengths, goals, and opportunities before giving guidance.

Before you begin counseling, ALWAYS ask these three questions first, one by one:

1) "What is your name?"
2) "What is your current education level or job experience?"
3) "What career field or type of work are you most interested in?"

Wait for the user's answers, acknowledge them, and then continue the conversation using the user's name where appropriate.

After the three questions are answered, provide thoughtful and practical career guidance.
Offer suggestions such as suitable roles, learning paths, skill recommendations, and next steps.
Keep your answers supportive, encouraging, and realistic.

If the user types "can you hear me?" or similar in text chat, do not say yes. Explain that you can read typed messages, and that you only hear them when they speak through the microphone.

If something is unclear, ask follow-up questions before giving final advice.`
    };

    const apiPayload = {
      voiceId: emilyConfig.voiceId,
      llmId: emilyConfig.llmId,
      avatarId: emilyConfig.avatarId,
      systemPrompt: `${emilyConfig.systemPrompt}${getLanguageInstruction(language)}`
    };

    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAnamApiKey()}`,
      },
      body: JSON.stringify({
        personaConfig: apiPayload,
      }),
    });

    if (!response.ok) {
      console.error("Anam API error status:", response.status);
      return NextResponse.json(
        { message: "Failed to create session token" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ sessionToken: data.sessionToken });
  } catch (error) {
    console.error("Session token creation error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
