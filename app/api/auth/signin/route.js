import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
    try {
        await dbConnect();

        const { email, password } = await request.json();

        // Check if user exists (case-insensitive email)
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid Credentials' },
                { status: 400 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid Credentials' },
                { status: 400 }
            );
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Sign token
        const options = {
            expiresIn: process.env.JWT_EXPIRY || '7d'
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            options
        );

        return NextResponse.json({
            token,
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
