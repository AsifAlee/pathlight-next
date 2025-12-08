import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/dbConnect";
import Note from "@/models/Note";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: "UserId required" }, { status: 400 });
    }

    try {
        const notes = await Note.find({ userId }).sort({ createdAt: 1 });
        return NextResponse.json({ notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }
}

export async function POST(req) {
    await dbConnect();

    try {
        const formData = await req.formData();
        const type = formData.get("type");
        const userId = formData.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let noteData = {
            userId,
            type,
            createdAt: new Date()
        };

        if (type === 'text') {
            const content = formData.get("content");
            noteData.content = content;
        } else if (type === 'image' || type === 'file') {
            const file = formData.get("file");
            if (!file) {
                return NextResponse.json({ error: "No file provided" }, { status: 400 });
            }

            // Convert file to buffer for Cloudinary
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to Cloudinary
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto",
                        folder: "counseling_notes"
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            noteData.fileUrl = uploadResult.secure_url;
            noteData.fileName = file.name;
        }

        const note = await Note.create(noteData);
        return NextResponse.json({ note });

    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
    }
}
