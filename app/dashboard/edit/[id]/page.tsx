'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        language: 'html', // Enforced
        code: '',
        tags: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/snippets/${resolvedParams.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.project) {
                    setFormData({
                        title: data.project.title,
                        description: data.project.description,
                        language: 'html', // Enforce HTML even if old data had others
                        code: data.project.code,
                        tags: data.project.tags.join(', ')
                    });
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [resolvedParams.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/snippets/${resolvedParams.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                alert('Failed to update project');
            }
        } catch (error) {
            alert('Error updating project');
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`/api/snippets/${resolvedParams.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            alert('Error deleting');
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh', maxWidth: '800px' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Link href="/dashboard" style={{ color: 'var(--text-secondary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
                    <h1 style={{ fontSize: '2rem' }}>Edit Page</h1>
                </div>
                <button onClick={handleDelete} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
                    Delete Page
                </button>
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
                    />
                </div>

                {/* Language hidden/enforced */}

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description (Meta)</label>
                    <textarea
                        required
                        className="glass-card"
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.2)', outline: 'none' }}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>HTML Content</label>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Content is automatically themed with the Dark Glass styling.
                    </p>
                    <textarea
                        required
                        className="glass-card"
                        rows={15}
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.5)', outline: 'none', fontFamily: 'monospace', fontSize: '0.9rem' }}
                        value={formData.code}
                        onChange={e => setFormData({ ...formData, code: e.target.value })}
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
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '1rem', fontSize: '1rem' }}>
                    Update Page
                </button>
            </form>
        </main>
    );
}
