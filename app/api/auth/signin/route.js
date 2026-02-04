import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        const emailLower = email.toLowerCase().trim();
        const passwordTrim = password.trim();

        // Hardcoded school login
        if (emailLower === 'usc@gmail.com' && passwordTrim === 'usc9987/.,') {
            const payload = {
                user: {
                    id: 'school-admin-001',
                    role: 'school'
                }
            };

            const options = {
                expiresIn: process.env.JWT_EXPIRY || '7d'
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET || 'your-secret-key',
                options
            );

            return NextResponse.json({
                token,
                user: {
                    id: 'school-admin-001',
                    name: 'USC School Admin',
                    email: 'usc@gmail.com',
                    role: 'school'
                }
            });
        }

        // Student login (database)
        await dbConnect();

        const user = await User.findOne({ email: emailLower });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid Credentials' },
                { status: 400 }
            );
        }

        // Check password
        const isMatch = await bcrypt.compare(passwordTrim, user.password);
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
