import Link from 'next/link';
import dbConnect from '@/lib/db';
import Snippet from '@/models/Snippet';

export const dynamic = 'force-dynamic';

async function getRecentSnippets() {
  await dbConnect();
  // Fetch latest 6 snippets
  return await Snippet.find({}).sort({ createdAt: -1 }).limit(6).lean();
}

export default async function Home() {
  // In a real scenario, handle error/loading. For now, we just call it.
  // We use try/catch to avoid build errors if DB is unreachable during build
  let snippets: any[] = [];
  try {
    snippets = await getRecentSnippets();
  } catch (error) {
    console.error("Failed to fetch snippets:", error);
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar Placeholder */}
      <nav className="glass-card" style={{ margin: '1rem', borderRadius: '100px', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Codex</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
          <Link href="/browse" style={{ color: 'var(--text-secondary)' }}>Browse</Link>
          <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Staff Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container" style={{ textAlign: 'center', padding: '4rem 0', flex: 1 }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: 1.1 }}>
          Codex Dev <br />
          <span className="gradient-text">average devs.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The premium repository for your team's most valuable code snippets.
          Accessible, searchable, and always ready.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/browse" className="btn-primary">Browse Library</Link>
          <Link href="/docs" className="btn-ghost">Documentation</Link>
        </div>
      </section>

      {/* Grid Section */}
      <section className="container" style={{ paddingBottom: '4rem' }}>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Latest Snippets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>

          {snippets.length === 0 ? (
            <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-secondary)' }}>No code found. Staff, please login to upload content.</p>
            </div>
          ) : (
            snippets.map((snip: any) => (
              <div key={snip._id} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(snip.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{snip.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  {snip.description}
                </p>
                <Link href={`/project/${snip._id}`} style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  View Project &rarr;
                </Link>
              </div>
            ))
          )}

        </div>
      </section>
    </main>
  );
}
