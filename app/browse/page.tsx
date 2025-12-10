'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BrowsePage() {
    const [snippets, setSnippets] = useState([]);
    const [filteredSnippets, setFilteredSnippets] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all snippets
        fetch('/api/snippets')
            .then(res => res.json())
            .then(data => {
                if (data.snippets) {
                    setSnippets(data.snippets);
                    setFilteredSnippets(data.snippets);
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    useEffect(() => {
        if (!snippets.length) return;
        const lowerSearch = search.toLowerCase();
        const filtered = snippets.filter((s: any) =>
            s.title.toLowerCase().includes(lowerSearch) ||
            s.description.toLowerCase().includes(lowerSearch) ||
            s.tags.some((t: string) => t.toLowerCase().includes(lowerSearch)) ||
            s.language.toLowerCase().includes(lowerSearch)
        );
        setFilteredSnippets(filtered);
    }, [search, snippets]);

    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh' }}>
            <nav style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>&larr; Home</Link>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Browse Library</h1>
            </nav>

            <div style={{ marginBottom: '3rem' }}>
                <input
                    type="text"
                    placeholder="Search codes by title, language, or tag..."
                    className="glass-card"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', color: 'white', background: 'rgba(0,0,0,0.2)', outline: 'none' }}
                />
            </div>

            {loading ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading library...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {filteredSnippets.length === 0 ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No codes found matching "{search}"</p>
                    ) : (
                        filteredSnippets.map((snip: any) => (
                            <div key={snip._id} className="glass-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(snip.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{snip.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {snip.description}
                                </p>
                                <Link href={`/project/${snip._id}`} style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    View Project &rarr;
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}
        </main>
    );
}
