import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Snippet from '@/models/Snippet';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await dbConnect();
        const project = await Snippet.findById(id).lean();

        if (!project) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Return the raw code as text/html if HTML, else text/plain
        const type = ((project as any).language || 'text').toLowerCase() === 'html' ? 'text/html' : 'text/plain';

        return new NextResponse((project as any).code, {
            headers: {
                'Content-Type': type,
            }
        });
    } catch (error) {
        return new NextResponse("Error", { status: 500 });
    }
}
