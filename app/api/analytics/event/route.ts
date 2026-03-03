import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AnalyticsEvent from '@/models/AnalyticsEvent';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { event, userId, userEmail, metadata } = body;

        if (!event || typeof event !== 'string') {
            return NextResponse.json({ error: 'event is required' }, { status: 400 });
        }

        await AnalyticsEvent.create({
            event: event.trim(),
            userId: userId || null,
            userEmail: userEmail || null,
            metadata: metadata || {},
        });

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        console.error('[analytics/event] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
