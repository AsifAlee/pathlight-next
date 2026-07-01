import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BetaApplication from '@/models/BetaApplication';
import { appendBetaApplicationToSheet } from '@/lib/googleSheets';

const requiredFields = [
    'fullName',
    'studentStatus',
    'schoolName',
    'studyFocus',
    'graduationYear',
    'studentEmail',
    'careerClarity',
    'chosenDirection',
    'wrongPathWorry',
    'careerConfusion',
    'fieldJobKnowledge',
    'usedCareerSupport',
    'adviceSource',
    'decisionConfidence',
    'feelingPressure',
    'decisionTimeline',
    'missedOpportunity',
    'rightPathOutcome',
    'canTestAndFeedback',
];

const cleanString = (value) => typeof value === 'string' ? value.trim() : value;

export async function POST(request) {
    try {
        const body = await request.json();
        const payload = Object.fromEntries(
            Object.entries(body).map(([key, value]) => [key, cleanString(value)])
        );

        for (const field of requiredFields) {
            if (payload[field] === undefined || payload[field] === null || payload[field] === '') {
                return NextResponse.json({ message: 'Please complete all required questions.' }, { status: 400 });
            }
        }

        if (payload.usedCareerSupport === 'Yes' && !payload.careerSupportName) {
            return NextResponse.json({ message: 'Please tell us which career support you used.' }, { status: 400 });
        }

        if (payload.feelingPressure === 'Yes' && !payload.pressureSource) {
            return NextResponse.json({ message: 'Please tell us where the pressure is coming from.' }, { status: 400 });
        }

        payload.studentEmail = payload.studentEmail.toLowerCase();
        payload.careerClarity = Number(payload.careerClarity);
        payload.decisionConfidence = Number(payload.decisionConfidence);
        payload.careerSupportHelped = payload.usedCareerSupport === 'Yes'
            ? payload.careerSupportHelped
            : 'Not applicable';

        await dbConnect();
        const application = await BetaApplication.create(payload);
        let sheetSynced = false;

        try {
            const sheetResult = await appendBetaApplicationToSheet(application.toObject());
            sheetSynced = !sheetResult.skipped;
        } catch (sheetError) {
            console.error('Google Sheets sync error:', sheetError);
        }

        return NextResponse.json({
            ok: true,
            applicationId: application._id,
            sheetSynced,
            message: 'Application submitted. We review every response and reply within a few days.',
        }, { status: 201 });
    } catch (error) {
        console.error('Beta application error:', error);

        if (error?.code === 11000) {
            return NextResponse.json({
                message: 'An application with this student email has already been submitted.',
            }, { status: 409 });
        }

        return NextResponse.json({
            message: error?.message || 'Unable to submit application right now.',
        }, { status: 500 });
    }
}
