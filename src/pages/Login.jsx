import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Target, AlertTriangle } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Gagal masuk. Pastikan koneksi internet stabil dan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--background)',
      color: 'var(--text-primary)'
    }}>
      
      {/* Logo & Branding */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        <Target size={36} color="var(--accent)" strokeWidth={1.8} />
      </div>
      
      <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '8px' }}>
        Alva Track<span style={{ color: 'var(--accent)' }}>.</span>
      </h1>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '280px', marginBottom: '48px', lineHeight: 1.5 }}>
        Bangun kebiasaan positif dan lacak progresmu setiap hari secara otomatis.
      </p>

      {/* Error Message */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
          padding: '12px 16px', borderRadius: 'var(--radius-md)',
          marginBottom: '24px', width: '100%', maxWidth: '320px'
        }}>
          <AlertTriangle size={18} color="var(--danger)" flexShrink={0} />
          <p style={{ fontSize: '12px', color: 'var(--danger)', lineHeight: 1.4 }}>{error}</p>
        </div>
      )}

      {/* Login Button */}
      <button
        onClick={handleLogin}
        disabled={loading}
        className="btn btn-primary"
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '16px',
          fontSize: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          opacity: loading ? 0.7 : 1
        }}
      >
        {/* Google G Logo SVG */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.67 15.63 16.89 16.79 15.72 17.57V20.34H19.29C21.37 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
          <path d="M12 23C14.97 23 17.46 22.01 19.29 20.34L15.72 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13 18.63 6.71 16.7 5.84 14.12H2.15V16.98C3.97 20.61 7.7 23 12 23Z" fill="#34A853"/>
          <path d="M5.84 14.12C5.62 13.46 5.49 12.75 5.49 12C5.49 11.25 5.61 10.54 5.84 9.88V7.02H2.15C1.4 8.52 0.98 10.21 0.98 12C0.98 13.79 1.4 15.48 2.15 16.98L5.84 14.12Z" fill="#FBBC05"/>
          <path d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.03L19.37 3.87C17.45 2.08 14.97 1 12 1C7.7 1 3.97 3.39 2.15 7.02L5.84 9.88C6.71 7.3 9.13 5.38 12 5.38Z" fill="#EA4335"/>
        </svg>
        <span style={{ color: 'var(--text-on-accent)', fontWeight: 700 }}>
          {loading ? 'Memproses...' : 'Lanjutkan dengan Google'}
        </span>
      </button>

      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Dengan masuk, kamu menyetujui Ketentuan Layanan dan<br />Kebijakan Privasi Alva Track.
        </p>
      </div>

    </div>
  );
}
