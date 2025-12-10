import Link from 'next/link';
import dbConnect from '@/lib/db';
import Snippet from '@/models/Snippet';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';

export const dynamic = 'force-dynamic';

async function getProject(id: string) {
    try {
        await dbConnect();
        const project = await Snippet.findById(id).lean();
        if (!project) return null;
        return project;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata(
    { params }: { params: Promise<{ id: string }> },
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const project: any = await getProject(id);
    if (!project) return { title: 'Sort N Save' };

    return {
        title: project.title,
        description: project.description,
        openGraph: {
            title: project.title,
            description: project.description,
            siteName: 'Codex CDN',
            type: 'website',
        }
    }
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project: any = await getProject(id);

    if (!project) {
        notFound();
    }

    // FORCE HTML MODE ALWAYS
    // We inject the premium theme CSS so the user's content looks like the site
    const themeCSS = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        
        :root {
            --bg-dark: #0f172a;
            --bg-secondary: #1e293b;
            --accent-primary: #38bdf8;
            --accent-secondary: #818cf8;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --glass-bg: rgba(30, 41, 59, 0.7);
            --glass-border: rgba(255, 255, 255, 0.08);
        }

        body { 
            margin: 0; 
            padding: 2rem; 
            font-family: 'Outfit', sans-serif; 
            background: linear-gradient(135deg, var(--bg-dark), #000000); 
            color: var(--text-primary);
            min-height: 100vh;
            line-height: 1.6;
        }

        h1, h2, h3, h4, h5, h6 {
            color: white;
            margin-top: 0;
            line-height: 1.2;
        }

        h1 { font-size: 2.5rem; margin-bottom: 1.5rem; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        h2 { font-size: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 0.5rem; }
        p { margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--text-secondary); }
        
        a { color: var(--accent-primary); text-decoration: none; transition: all 0.2s; }
        a:hover { color: var(--accent-secondary); text-decoration: underline; }

        /* Card Style for Containers */
        .card, div.container, section {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Button Styles */
        button, .btn {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
            transition: opacity 0.2s;
            display: inline-block;
        }
        button:hover, .btn:hover { opacity: 0.9; text-decoration: none; }

        /* Code Blocks */
        pre, code {
            background: rgba(0,0,0,0.3);
            border-radius: 6px;
            font-family: 'JetBrains Mono', monospace;
            padding: 0.2rem 0.5rem;
            color: #e2e8f0;
        }
        pre { padding: 1rem; overflow-x: auto; }

        /* Lists */
        ul, ol { padding-left: 1.5rem; margin-bottom: 1.5rem; color: var(--text-secondary); }
        li { margin-bottom: 0.5rem; }

        /* Images */
        img { max-width: 100%; border-radius: 8px; height: auto; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--bg-dark); }
        ::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }
    </style>
  `;

    const previewContent = themeCSS + project.code;

    return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>&larr; Back</Link>
                    <span style={{ fontWeight: 600 }}>{project.title}</span>
                </div>

            </nav>
            <iframe
                srcDoc={previewContent}
                style={{ flex: 1, width: '100%', border: 'none', background: 'var(--bg-dark)' }}
                title="Preview"
                // We allow scripts/modals so the user's HTML can be interactive
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
            />
        </div>
    );
}
