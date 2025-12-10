'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProjectPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        language: 'html', // Enforced
        code: '',
        tags: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/snippets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                alert('Failed to publish project');
            }
        } catch (error) {
            alert('Error publishing project');
        }
    };

    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh', maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/dashboard" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
                <h1 style={{ fontSize: '2rem' }}>Create New Page</h1>
            </div>

            <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Page Title</label>
                    <input
                        type="text"
                        required
                        className="glass-card"
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)', outline: 'none' }}
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., My Awesome Article"
                    />
                </div>

                {/* Hidden/Implicit Language Field */}

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description (Meta)</label>
                    <textarea
                        required
                        className="glass-card"
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)', outline: 'none' }}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Short summary for search engines and social cards..."
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>HTML Content</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Write your raw HTML body content here. We will automatically apply the site's premium theme (colors, fonts, background) to it.
                    </p>
                    <textarea
                        required
                        className="glass-card"
                        rows={15}
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.5)', outline: 'none', fontFamily: 'monospace', fontSize: '0.9rem' }}
                        value={formData.code}
                        onChange={e => setFormData({ ...formData, code: e.target.value })}
                        placeholder="<h1>Hello World</h1><p>Start writing...</p>"
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tags</label>
                    <input
                        type="text"
                        className="glass-card"
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)', outline: 'none' }}
                        value={formData.tags}
                        onChange={e => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Comma separated: blog, update, news"
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem' }}>
                    Publish Page
                </button>
            </form>
        </main>
    );
}
