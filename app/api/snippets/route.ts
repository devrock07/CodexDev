import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Snippet from '@/models/Snippet';
import { jwtVerify } from 'jose';
import { JWT_SECRET } from '@/lib/auth-config';

// Helper to check auth
async function isAuthenticated(req: Request) {
    const cookie = req.headers.get('cookie');
    const token = cookie?.split('token=')[1]?.split(';')[0];
    if (!token) return false;
    try {
        await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        return true;
    } catch {
        return false;
    }
}

export async function POST(req: Request) {
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, description, code, language, tags } = await req.json();
        await dbConnect();

        // Split tags string into array if needed
        const tagsArray = Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim());

        const snippet = await Snippet.create({
            title,
            description,
            code,
            language,
            tags: tagsArray
        });

        return NextResponse.json({ success: true, snippet });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create snippet' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    // Public can read, so no auth check strictly needed for GET, but maybe dashboard needs all?
    // Use query param to filter if needed.
    try {
        await dbConnect();
        const snippets = await Snippet.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ snippets });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
