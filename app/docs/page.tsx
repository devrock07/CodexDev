import Link from 'next/link';

export default function DocsPage() {
    return (
        <main className="container" style={{ padding: '2rem 1.5rem', minHeight: '100vh', maxWidth: '800px' }}>
            <nav style={{ marginBottom: '3rem' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>&larr; Home</Link>
            </nav>

            <article>
                <h1 style={{ fontSize: '3rem', marginBottom: '2rem', lineHeight: 1.1 }}>Documentation</h1>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>Getting Started</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        Codex CDN is a centralized repository for your organization's code, configurations, and reusable modules.
                        It is designed to facilitate easy sharing and discovery of technical assets.
                    </p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>For Developers</h2>
                    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Browsing Code</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Navigate to the <Link href="/browse" style={{ color: 'var(--accent-primary)' }}>Browse</Link> page to search for codes.
                            You can filter by language, tags, or keywords in the title.
                        </p>
                    </div>
                    <div className="glass-card">
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Using Code</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            Click on any code card to view the full source. Use the "Copy" functionality (coming soon) or select the text to paste directly into your IDE.
                        </p>
                    </div>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'white' }}>For Staff</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        Staff members have write access to the repository.
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>1.</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                Log in via the <Link href="/login" style={{ color: 'white', textDecoration: 'underline' }}>Staff Portal</Link>.
                            </span>
                        </li>
                        <li style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>2.</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                Go to your Dashboard to manage existing projects.
                            </span>
                        </li>
                        <li style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                            <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>3.</span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                                Click "New Project" to publish code. Supports standard syntax highlighting for JS, TS, Python, etc.
                            </span>
                        </li>
                    </ul>
                </section>
            </article>
        </main>
    );
}
