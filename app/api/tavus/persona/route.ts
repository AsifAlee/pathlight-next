import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

        if (!TAVUS_API_KEY) {
            return NextResponse.json(
                { message: "Tavus API key not configured" },
                { status: 500 }
            );
        }

        const response = await fetch("https://tavusapi.com/v2/personas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": TAVUS_API_KEY,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Tavus API error:", errorData);
            return NextResponse.json(
                { message: "Failed to create persona", error: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Tavus API handler error:", error);
        return NextResponse.json(
            { message: "Server Error", error: error.message },
            { status: 500 }
        );
    }
}
