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
        console.log("ANAM_API_KEY", ANAM_API_KEY);

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

                    avatarId: '307885c3-5ee3-4fbc-807c-909f0036f187',
                    voiceId: 'e54745c7-9439-44c3-b61a-193b42cce5bd',
                    llmId: '0934d97d-0c3a-4f33-91b0-5e136a0ef466',
                    systemPrompt: 'you are william shakespear that talks alot about love and poetry',
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
