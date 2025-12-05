import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        const ANAM_API_KEY = process.env.NEXT_PUBLIC_ANAM_API_KEY;

        if (!ANAM_API_KEY) {
            return NextResponse.json(
                { message: 'Anam API key not configured' },
                { status: 500 }
            );
        }

        // Create session token with Anam.ai
        const response = await fetch('https://api.anam.ai/v1/auth/session-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ANAM_API_KEY}`,
            },
            body: JSON.stringify({
                personaConfig: {
                    name: 'PathLight Counselor',
                    avatarId: '30fa96d0-26c4-4e55-94a0-517025942e18',
                    voiceId: '6bfbe25a-979d-40f3-a92b-5394170af54b',
                    llmId: '0934d97d-0c3a-4f33-91b0-5e136a0ef466',
                    systemPrompt: 'You are a compassionate and professional mental health counselor for students. Provide supportive, empathetic guidance while maintaining appropriate boundaries. Keep responses conversational and helpful.',
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Anam API error:', errorData);
            return NextResponse.json(
                { message: 'Failed to create session token', error: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json({ sessionToken: data.sessionToken });

    } catch (error: any) {
        console.error('Session token creation error:', error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}
