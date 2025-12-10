import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import File from '@/models/File';

export const dynamic = 'force-dynamic';

// Serve file as binary (for downloads and Discord embeds)
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await dbConnect();

        const file = await File.findById(id);

        if (!file) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Extract base64 data from data URL (format: data:image/png;base64,...)
        const matches = file.fileUrl.match(/^data:([^;]+);base64,(.+)$/);

        if (!matches) {
            console.error('Invalid data URL format');
            return NextResponse.json({ error: 'Invalid file format' }, { status: 500 });
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        // Return file as binary with proper headers
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `inline; filename="${file.originalName}"`,
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json({
            error: 'Failed to serve file',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
