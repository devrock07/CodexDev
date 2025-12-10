'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BrowsePage() {
    const [snippets, setSnippets] = useState([]);
    const [filteredSnippets, setFilteredSnippets] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

    useEffect(() => {
        // Fetch all snippets
        fetch('/api/snippets')
            .then(res => res.json())
            .then(data => {
                if (data.snippets) {
                    setSnippets(data.snippets);
                    setFilteredSnippets(data.snippets);

                    // Extract unique languages
                    const languages = Array.from(new Set(
                        data.snippets.map((s: any) => s.language).filter(Boolean)
                    )) as string[];
                    setAvailableLanguages(languages);
                }
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    useEffect(() => {
        if (!snippets.length) return;
        const lowerSearch = search.toLowerCase();
        const filtered = snippets.filter((s: any) => {
            const matchesSearch = !search ||
                s.title.toLowerCase().includes(lowerSearch) ||
                s.description.toLowerCase().includes(lowerSearch) ||
                s.tags?.some((t: string) => t.toLowerCase().includes(lowerSearch)) ||
                s.language?.toLowerCase().includes(lowerSearch);

            const matchesLanguage = !selectedLanguage || s.language === selectedLanguage;

            return matchesSearch && matchesLanguage;
        });
        setFilteredSnippets(filtered);
    }, [search, snippets, selectedLanguage]);

    return (
        <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header */}
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
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
                            href="/"
                            className="btn btn-ghost"
                            style={{
                                padding: '0.5rem 1rem',
                                marginBottom: '1rem',
                                display: 'inline-flex'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Back
                        </Link>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 3rem)',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            marginBottom: '0.5rem'
                        }}>
                            Browse <span className="gradient-text">Library</span>
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                            Explore {snippets.length} premium code projects
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by title, language, tags, or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 3rem 1rem 3rem',
                            fontSize: '1rem',
                            background: 'var(--card-bg)',
                            border: '1px solid var(--card-border)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--text-primary)',
                            transition: 'all var(--transition-base)',
                            outline: 'none'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--accent-primary)';
                            e.target.style.boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'var(--card-border)';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'color var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>


            </div>

            {/* Results */}
            <div className="container">
                {loading ? (
                    <div className="grid grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="glass-card-static">
                                <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '1rem' }}></div>
                                <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '0.5rem' }}></div>
                                <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '1rem' }}></div>
                                <div className="skeleton" style={{ height: '36px', width: '120px' }}></div>
                            </div>
                        ))}
                    </div>
                ) : filteredSnippets.length === 0 ? (
                    <div className="glass-card" style={{
                        textAlign: 'center',
                        padding: '4rem 2rem'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                            No Projects Found
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            {search ? `No results for "${search}"` : 'Try adjusting your filters'}
                        </p>
                        {(search || selectedLanguage) && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSelectedLanguage(null);
                                }}
                                className="btn btn-primary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div style={{
                            marginBottom: '1.5rem',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem'
                        }}>
                            Showing {filteredSnippets.length} {filteredSnippets.length === 1 ? 'project' : 'projects'}
                        </div>
                        <div className="grid grid-cols-3 animate-fadeIn">
                            {filteredSnippets.map((snip: any, index: number) => (
                                <div
                                    key={snip._id}
                                    className="glass-card"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        animationDelay: `${index * 0.05}s`
                                    }}
                                >
                                    <div style={{ marginBottom: '1rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-tertiary)'
                                        }}>
                                            {new Date(snip.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        marginBottom: '0.75rem',
                                        fontWeight: 600,
                                        lineHeight: 1.3
                                    }}>
                                        {snip.title}
                                    </h3>

                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.9rem',
                                        marginBottom: '1.5rem',
                                        lineHeight: 1.6,
                                        flex: 1,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {snip.description}
                                    </p>

                                    {snip.tags && snip.tags.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            flexWrap: 'wrap',
                                            marginBottom: '1rem'
                                        }}>
                                            {snip.tags.slice(0, 3).map((tag: string, i: number) => (
                                                <span key={i} className="badge" style={{ fontSize: '0.7rem' }}>
                                                    {tag}
                                                </span>
                                            ))}
                                            {snip.tags.length > 3 && (
                                                <span className="badge" style={{ fontSize: '0.7rem' }}>
                                                    +{snip.tags.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}


                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link
                                            href={`/project/${snip._id}`}
                                            className="btn btn-ghost"
                                            style={{
                                                padding: '0.625rem 1rem',
                                                fontSize: '0.875rem',
                                                flex: 1,
                                                justifyContent: 'center'
                                            }}
                                        >
                                            View Project
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                                <polyline points="12 5 19 12 12 19"></polyline>
                                            </svg>
                                        </Link>
                                        {snip.downloadUrl && (
                                            <a
                                                href={snip.downloadUrl}
                                                download
                                                className="btn btn-secondary"
                                                style={{
                                                    padding: '0.625rem 1rem',
                                                    fontSize: '0.875rem'
                                                }}
                                                title="Download ZIP"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
