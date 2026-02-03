import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { persona_id, replica_id } = body;
        const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

        if (!TAVUS_API_KEY) {
            return NextResponse.json(
                { message: "Tavus API key not configured" },
                { status: 500 }
            );
        }

        if (!persona_id && !replica_id) {
            return NextResponse.json(
                { message: "Missing persona_id or replica_id" },
                { status: 400 }
            );
        }

        // Defaults if not provided, though persona_id or replica_id is required
        const payload = {
            persona_id,
            replica_id,
            // Add other optional parameters here as needed, getting them from body
            ...body
        };


        const response = await fetch("https://tavusapi.com/v2/conversations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": TAVUS_API_KEY,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Tavus API conversation error:", errorData);
            return NextResponse.json(
                { message: "Failed to create conversation", error: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Tavus API conversation handler error:", error);
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}
