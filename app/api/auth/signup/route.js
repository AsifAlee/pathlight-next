import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
    try {
        await dbConnect();

        const { name, email, role, firebaseUid } = await request.json();

        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();

        // Check if user already exists
        let user = await User.findOne({ 
            $or: [
                { email: normalizedEmail },
                { firebaseUid: firebaseUid }
            ]
        });

        if (user) {
            // Update firebaseUid if it was missing
            if (firebaseUid && !user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                await user.save();
            }
            return NextResponse.json({
                message: 'User already exists',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }, { status: 200 });
        }

        // Create new user
        user = await User.create({
            name,
            email: normalizedEmail,
            role: role || 'student',
            firebaseUid
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Server Error', error: error.message },
            { status: 500 }
        );
    }
}
