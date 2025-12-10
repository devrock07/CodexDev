'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function CDNDashboard() {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'image' | 'zip'>('all');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await fetch('/api/files');
            const data = await res.json();
            if (data.files) {
                setFiles(data.files);
            }
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch files:', error);
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) return;

        setUploading(true);
        try {
            const file = selectedFiles[0];

            // Check file size (max 64MB)
            if (file.size > 64 * 1024 * 1024) {
                alert('File too large. Maximum size is 64MB.');
                setUploading(false);
                return;
            }

            // Upload file
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await fetch('/api/uploadthing', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) {
                throw new Error('Upload failed');
            }

            const uploadData = await uploadRes.json();

            // Refresh file list
            fetchFiles();
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            await fetch(`/api/files?id=${id}`, { method: 'DELETE' });
            fetchFiles();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const copyToClipboard = (fileId: string) => {
        const url = `${window.location.origin}/cdn/${fileId}`;
        navigator.clipboard.writeText(url);
        setCopiedId(fileId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredFiles = files.filter(f => filter === 'all' || f.fileType === filter);
    const totalSize = files.reduce((acc, f) => acc + f.fileSize, 0);
    const totalDownloads = files.reduce((acc, f) => acc + f.downloads, 0);

    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <Link
                        href="/dashboard"
                        className="btn btn-ghost"
                        style={{ padding: '0.5rem 1rem', marginBottom: '1rem', display: 'inline-flex' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back
                    </Link>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        marginBottom: '0.5rem'
                    }}>
                        CDN <span className="gradient-text">Files</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Upload and manage your files
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: '2rem'
            }}>
                <div className="glass-card-static" style={{
                    background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.05))',
                    borderColor: 'rgba(56, 189, 248, 0.2)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Files
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', fontFamily: 'var(--font-display)' }}>
                        {files.length}
                    </div>
                </div>

                <div className="glass-card-static" style={{
                    background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.1), rgba(192, 132, 252, 0.05))',
                    borderColor: 'rgba(192, 132, 252, 0.2)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Storage Used
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)', fontFamily: 'var(--font-display)' }}>
                        {(totalSize / 1024 / 1024).toFixed(1)}MB
                    </div>
                </div>

                <div className="glass-card-static" style={{
                    background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(74, 222, 128, 0.05))',
                    borderColor: 'rgba(74, 222, 128, 0.2)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Downloads
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-success)', fontFamily: 'var(--font-display)' }}>
                        {totalDownloads}
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem 2rem' }}>
                <input
                    type="file"
                    id="file-upload"
                    accept="image/*,.zip"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={uploading}
                />
                <label
                    htmlFor="file-upload"
                    className="btn btn-primary"
                    style={{
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        opacity: uploading ? 0.6 : 1,
                        fontSize: '1.1rem',
                        padding: '1rem 2rem'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </label>
                <p style={{ color: 'var(--text-tertiary)', marginTop: '1rem', fontSize: '0.875rem' }}>
                    Supports images (PNG, JPG, GIF, WEBP) and ZIP files up to 64MB
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setFilter('all')}
                    className={filter === 'all' ? 'badge badge-primary' : 'badge'}
                    style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    All ({files.length})
                </button>
                <button
                    onClick={() => setFilter('image')}
                    className={filter === 'image' ? 'badge badge-primary' : 'badge'}
                    style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    Images ({files.filter(f => f.fileType === 'image').length})
                </button>
                <button
                    onClick={() => setFilter('zip')}
                    className={filter === 'zip' ? 'badge badge-primary' : 'badge'}
                    style={{ cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                    ZIP Files ({files.filter(f => f.fileType === 'zip').length})
                </button>
            </div>

            {/* Files Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    Loading files...
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Files Yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Upload your first file to get started
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3">
                    {filteredFiles.map((file: any) => (
                        <div key={file._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* File Preview */}
                            <div style={{
                                width: '100%',
                                height: '150px',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: '1rem',
                                background: 'var(--card-bg-hover)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {file.fileType === 'image' ? (
                                    <img
                                        src={file.thumbnailUrl || file.fileUrl}
                                        alt={file.originalName}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="12" y1="18" x2="12" y2="12"></line>
                                        <line x1="9" y1="15" x2="15" y2="15"></line>
                                    </svg>
                                )}
                            </div>

                            {/* File Info */}
                            <h3 style={{
                                fontSize: '1rem',
                                marginBottom: '0.5rem',
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {file.originalName}
                            </h3>

                            <div style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginBottom: '1rem',
                                fontSize: '0.75rem',
                                color: 'var(--text-tertiary)'
                            }}>
                                <span>{(file.fileSize / 1024).toFixed(1)}KB</span>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                <button
                                    onClick={() => copyToClipboard(file._id)}
                                    className="btn btn-primary"
                                    style={{ flex: 1, fontSize: '0.875rem', padding: '0.625rem' }}
                                >
                                    {copiedId === file._id ? (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                            Copy URL
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(file._id)}
                                    className="btn-icon"
                                    style={{ padding: '0.625rem' }}
                                    title="Delete"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
