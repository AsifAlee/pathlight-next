import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        // In a stateless JWT setup, logout is primarily handled client-side
        // by removing the token from localStorage/cookies
        // This endpoint can be used for logging/analytics or token blacklisting if needed

        return NextResponse.json({
            message: 'Logged out successfully'
        }, { status: 200 });

    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}
