import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import AnalyticsEvent from '@/models/AnalyticsEvent';
import User from '@/models/User';

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Run all aggregations in parallel
        const [
            totalUsers,
            totalSessions,
            totalPageViews,
            totalSignups,
            recentEvents,
            eventsByDay,
            sessionsByCounselor,
            topEvents,
        ] = await Promise.all([
            // Total registered users
            User.countDocuments(),

            // Total counseling sessions started
            AnalyticsEvent.countDocuments({ event: 'session_start' }),

            // Total page views
            AnalyticsEvent.countDocuments({ event: 'page_view' }),

            // Total signups
            AnalyticsEvent.countDocuments({ event: 'signup' }),

            // 20 most recent events
            AnalyticsEvent.find()
                .sort({ createdAt: -1 })
                .limit(20)
                .lean(),

            // Events grouped by day (last 30 days)
            AnalyticsEvent.aggregate([
                { $match: { createdAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
                { $project: { date: '$_id', count: 1, _id: 0 } },
            ]),

            // Sessions grouped by counselor name
            AnalyticsEvent.aggregate([
                { $match: { event: 'session_start' } },
                {
                    $group: {
                        _id: '$metadata.counselor',
                        sessions: { $sum: 1 },
                    },
                },
                { $sort: { sessions: -1 } },
                { $project: { name: { $ifNull: ['$_id', 'Unknown'] }, sessions: 1, _id: 0 } },
            ]),

            // Top 5 event types by count
            AnalyticsEvent.aggregate([
                {
                    $group: {
                        _id: '$event',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 8 },
                { $project: { event: '$_id', count: 1, _id: 0 } },
            ]),
        ]);

        return NextResponse.json({
            summary: {
                totalUsers,
                totalSessions,
                totalPageViews,
                totalSignups,
            },
            recentEvents,
            eventsByDay,
            sessionsByCounselor,
            topEvents,
        });
    } catch (error) {
        console.error('[analytics/summary] error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
