import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'NOT_SET';

        await dbConnect();

        const dbState = mongoose.connection.readyState; // 1 = connected
        const dbName = mongoose.connection.db?.databaseName || 'UNKNOWN';
        const host = mongoose.connection.host;

        // Try to find users
        const userCount = await User.countDocuments();
        const users = await User.find({}, 'username role').lean();

        return NextResponse.json({
            status: 'Diagnostic Report',
            env: {
                hasMongoUri: mongoUri !== 'NOT_SET',
                mongoUriPrefix: mongoUri.substring(0, 15) + '...', // Safe preview
                nodeEnv: process.env.NODE_ENV,
            },
            database: {
                connected: dbState === 1,
                readyState: dbState,
                name: dbName,
                host: host,
            },
            data: {
                userCount: userCount,
                usersFound: users, // Will list usernames like 'devrock69'
                collectionName: User.collection.name
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            error: 'Diagnostic Failed',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
