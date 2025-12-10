'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setStatus('loading');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                // Allow success animation to play
                setTimeout(() => {
                    router.push('/dashboard');
                }, 800);
            } else {
                setStatus('idle');
                setError(data.error || 'Access Denied');
                // Trigger shake animation logic if we had it, for now just text
            }
        } catch (err) {
            setStatus('idle');
            setError('Connection Error');
        }
    };

    return (
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e293b 0%, #000000 100%)' }}>
            <div className={`glass-card ${error ? 'shake' : ''}`} style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Visual Security Element: Top Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: status === 'loading' ? 'var(--accent-primary)' : (status === 'success' ? '#10b981' : 'transparent'), transition: 'all 0.3s' }}>
                    {status === 'loading' && <div className="loading-bar"></div>}
                </div>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: error ? '#f87171' : (status === 'success' ? '#10b981' : 'var(--text-primary)') }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>RESTRICTED ACCESS</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}>
                        Authorized Personnel Only
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.9rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold' }}>⚠</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="glass-card"
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', color: 'white', background: 'rgba(0,0,0,0.3)', outline: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', transition: 'all 0.2s' }}
                            placeholder="Operator ID"
                            required
                            disabled={status === 'loading'}
                        />
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>@</span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="glass-card"
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', color: 'white', background: 'rgba(0,0,0,0.3)', outline: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', transition: 'all 0.2s' }}
                            placeholder="Access Key"
                            required
                            disabled={status === 'loading'}
                        />
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1rem' }}>⚿</span>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        style={{
                            marginTop: '1rem',
                            background: status === 'success' ? '#10b981' : 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontWeight: 600,
                            cursor: status === 'loading' ? 'wait' : 'pointer',
                            transition: 'all 0.3s',
                            opacity: status === 'loading' ? 0.7 : 1,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {status === 'loading' ? 'Verifying Credentials...' : (status === 'success' ? 'Access Granted' : 'Authenticate')}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
                        SECURE CONNECTION • 256-BIT ENCRYPTION
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
                    20%, 40%, 60%, 80% { transform: translateX(4px); }
                }
                .shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                .loading-bar {
                    height: 100%;
                    width: 50%;
                    background: rgba(255,255,255,0.3);
                    animation: loading 1s infinite linear;
                }
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </main>
    );
}
