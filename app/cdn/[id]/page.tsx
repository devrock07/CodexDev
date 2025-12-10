import { Metadata } from 'next';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import File from '@/models/File';

export const dynamic = 'force-dynamic';

async function getFile(id: string) {
    await dbConnect();
    const file = await File.findById(id).lean();
    return file;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const file = await getFile(id);

    if (!file) {
        return {
            title: 'File Not Found - Codex CDN',
        };
    }

    // Use download endpoint URL for Discord embeds
    const fileUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/files/${id}/download`;

    return {
        title: `${file.originalName} - Codex CDN`,
        description: `Download ${file.originalName} from Codex CDN - ${(file.fileSize / 1024).toFixed(1)}KB`,
        openGraph: {
            title: file.originalName,
            description: `Download from Codex CDN - ${(file.fileSize / 1024).toFixed(1)}KB`,
            images: file.fileType === 'image' ? [fileUrl] : [],
            type: 'website',
        },
        twitter: {
            card: file.fileType === 'image' ? 'summary_large_image' : 'summary',
            title: file.originalName,
            description: `Download from Codex CDN - ${(file.fileSize / 1024).toFixed(1)}KB`,
            images: file.fileType === 'image' ? [fileUrl] : [],
        },
    };
}

export default async function CDNFilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const file = await getFile(id);

    if (!file) {
        return (
            <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>File Not Found</h1>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        The file you're looking for doesn't exist or has been removed.
                    </p>
                    <Link href="/" className="btn btn-primary">
                        Go Home
                    </Link>
                </div>
            </main>
        );
    }

    // Use download endpoint for file access
    const downloadUrl = `/api/files/${id}/download`;

    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <Link
                    href="/"
                    className="btn btn-ghost"
                    style={{ padding: '0.5rem 1rem', marginBottom: '2rem', display: 'inline-flex' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Home
                </Link>

                {/* File Card */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    {/* File Preview */}
                    {file.fileType === 'image' ? (
                        <div style={{
                            width: '100%',
                            maxHeight: '400px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem',
                            overflow: 'hidden',
                            background: 'var(--card-bg-hover)'
                        }}>
                            <img
                                src={downloadUrl}
                                alt={file.originalName}
                                style={{ width: '100%', height: 'auto', display: 'block' }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '200px',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '2rem',
                            background: 'var(--card-bg-hover)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="12" y1="18" x2="12" y2="12"></line>
                                <line x1="9" y1="15" x2="15" y2="15"></line>
                            </svg>
                        </div>
                    )}

                    {/* File Info */}
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: 700,
                        marginBottom: '1rem'
                    }}>
                        {file.originalName}
                    </h1>

                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        color: 'var(--text-secondary)'
                    }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                Type
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {file.fileType === 'image' ? 'Image' : 'ZIP Archive'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                Size
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {(file.fileSize / 1024).toFixed(1)} KB
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                Uploaded
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {new Date(file.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <a
                        href={downloadUrl}
                        download={file.originalName}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '1rem',
                            fontSize: '1.1rem'
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        Download {file.originalName}
                    </a>
                </div>

                {/* Info Box */}
                <div className="glass-card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Hosted by Codex CDN
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                This file is securely hosted and available for direct download. Share this link anywhere!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
