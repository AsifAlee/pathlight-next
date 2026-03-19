import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
    try {
        const { email, firebaseUid } = await request.json();

        const emailLower = email.toLowerCase().trim();

        // Hardcoded school login (keep for now or migrate to firebase)
        if (emailLower === 'usc@gmail.com' && !firebaseUid) {
            // ... original hardcoded logic could stay here if needed for testing
            // But we prefer Firebase now.
        }

        await dbConnect();

        let user = await User.findOne({ 
            $or: [
                { email: emailLower },
                { firebaseUid: firebaseUid }
            ]
        });

        if (!user) {
            return NextResponse.json(
                { message: 'User profile not found in database. Please sign up.' },
                { status: 404 }
            );
        }

        // Update firebaseUid if missing
        if (firebaseUid && !user.firebaseUid) {
            user.firebaseUid = firebaseUid;
            await user.save();
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Signin error:', error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}
