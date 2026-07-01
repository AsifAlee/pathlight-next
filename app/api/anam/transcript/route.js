import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbConnect";
import Transcript from "../../../../models/Transcript";
import User from "../../../../models/User";

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    return secret;
};

export async function POST(req) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing or invalid token" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, getJwtSecret());
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid or expired token" },
                { status: 401 }
            );
        }

        // Get payload
        const body = await req.json();
        const { sessionId, personaId, messages } = body;

        if (!messages || !Array.isArray(messages)) {
             return NextResponse.json(
                { success: false, message: "Bad Request: messages array is required" },
                { status: 400 }
            );
        }

        let userEmail = decoded?.user?.email || "unknown@anonymous.com";
        if (mongoose.Types.ObjectId.isValid(decoded?.user?.id || "")) {
            const user = await User.findById(decoded.user.id).lean();
            userEmail = user?.email || userEmail;
        }

        const transcriptPayload = {
            userId: decoded?.user?.id || "unknown",
            userEmail: userEmail,
            sessionId: sessionId || "unknown",
            personaId: personaId || "unknown",
            messages: messages.map(m => ({
                role: m.role,
                content: m.content,
                timestamp: m.timestamp ? new Date(m.timestamp) : new Date()
            }))
        };

        const transcript = await Transcript.findOneAndUpdate(
            {
                userId: transcriptPayload.userId,
                sessionId: transcriptPayload.sessionId
            },
            {
                $set: transcriptPayload,
                $setOnInsert: { createdAt: new Date() }
            },
            {
                new: true,
                upsert: true
            }
        );

        return NextResponse.json({
            success: true,
            message: "Transcript saved successfully",
            transcriptId: transcript._id
        });

    } catch (error) {
        console.error("Transcript save error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to save transcript" },
            { status: 500 }
        );
    }
}

export async function GET(req) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing or invalid token" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, getJwtSecret());
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid or expired token" },
                { status: 401 }
            );
        }

        const userId = decoded?.user?.id;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing user" },
                { status: 401 }
            );
        }

        const transcripts = await Transcript.find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return NextResponse.json({
            success: true,
            transcripts
        });
    } catch (error) {
        console.error("Transcript fetch error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch transcripts" },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing or invalid token" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, getJwtSecret());
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid or expired token" },
                { status: 401 }
            );
        }

        const userId = decoded?.user?.id;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Missing user" },
                { status: 401 }
            );
        }

        const result = await Transcript.deleteMany({ userId });

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount || 0
        });
    } catch (error) {
        console.error("Transcript delete error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to clear transcripts" },
            { status: 500 }
        );
    }
}
