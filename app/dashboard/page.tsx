import Link from 'next/link';
import dbConnect from '@/lib/db';
import Snippet from '@/models/Snippet';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getSnippets() {
    await dbConnect();
    return await Snippet.find({}).sort({ createdAt: -1 }).lean();
}

export default async function Dashboard() {
    const snippets = await getSnippets();

    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Dashboard</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/" className="btn-ghost">View Site</Link>
                    <Link href="/dashboard/new" className="btn-primary">
                        + New Project
                    </Link>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <tr>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Title</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {snippets.map((snip: any) => (
                            <tr key={snip._id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{snip.title}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{new Date(snip.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem' }}>
                                    <Link href={`/dashboard/edit/${snip._id}`} style={{ marginRight: '1rem', color: 'var(--accent-primary)' }}>Edit</Link>
                                    {/* Delete would need client interaction or server action, skipping simple link for now */}
                                </td>
                            </tr>
                        ))}
                        {snippets.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No projects found. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
