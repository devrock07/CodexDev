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

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await dbConnect();
        const project = await Snippet.findById(id);
        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ project });
    } catch (error) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { title, description, code, language, tags } = await req.json();
        await dbConnect();

        const tagsArray = Array.isArray(tags) ? tags : tags?.split(',').map((t: string) => t.trim());

        const project = await Snippet.findByIdAndUpdate(
            id,
            { title, description, code, language, tags: tagsArray },
            { new: true }
        );

        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, project });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if (!(await isAuthenticated(req))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const project = await Snippet.findByIdAndDelete(id);
        if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
