import React, { useState, useEffect, useContext } from 'react';
import { User, Moon, Sun, Trash2, Info, AlertTriangle } from 'lucide-react';
import { getUser, saveUser, resetAllData, getHabits, getCompletions } from '../services/habitService';
import { ThemeContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { logout } = useAuth();
  const [user, setUser]         = useState({ name: '' });
  const [nameInput, setNameInput] = useState('');
  const [nameSaved, setNameSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [stats, setStats]       = useState({ habits: 0, completions: 0 });

  useEffect(() => {
    const loadData = async () => {
      const u = await getUser();
      setUser(u);
      setNameInput(u.name || '');
      
      const [h, c] = await Promise.all([getHabits(), getCompletions()]);
      setStats({
        habits: h.length,
        completions: c.filter(comp => comp.completed).length,
      });
    };
    loadData();
  }, []);

  const handleSaveName = async () => {
    const name = nameInput.trim() || 'Alva';
    await saveUser({ name });
    setUser(prev => ({ ...prev, name }));
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  };

  const handleToggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await saveUser({ theme: newTheme });
  };

  const handleReset = async () => {
    await resetAllData();
    setStats({ habits: 0, completions: 0 });
    setShowResetConfirm(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <h1>Pengaturan<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p>Konfigurasi akun dan tampilan</p>
      </div>

      {/* Profile Card */}
      <div
        className="card"
        style={{ marginBottom: '16px', borderTop: '2px solid var(--accent)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          {/* Avatar */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={22} color="var(--accent)" strokeWidth={1.8} />
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {user.name || 'Alva'}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {stats.habits} habit &middot; {stats.completions} check-in
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="form-input"
            value={nameInput}
            onChange={e => setNameInput(e.target.value)}
            placeholder="Nama kamu"
            id="settings-name-input"
            onKeyDown={e => e.key === 'Enter' && handleSaveName()}
            style={{ flex: 1 }}
          />
          <button
            className="btn btn-primary"
            onClick={handleSaveName}
            id="settings-save-name-btn"
            style={{ padding: '10px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {nameSaved ? 'Tersimpan' : 'Simpan'}
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <p className="section-label" style={{ marginBottom: '4px' }}>Tampilan</p>

        <div className="settings-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'var(--surface-soft)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isDark
                ? <Moon size={16} color="var(--accent)" strokeWidth={1.8} />
                : <Sun  size={16} color="var(--text-secondary)" strokeWidth={1.8} />
              }
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isDark ? 'Tampilan gelap aktif' : 'Tampilan terang aktif'}
              </p>
            </div>
          </div>
          <div
            className={`toggle ${isDark ? 'active' : ''}`}
            onClick={handleToggleTheme}
            role="switch"
            aria-checked={isDark}
            tabIndex={0}
            id="dark-mode-toggle"
            onKeyDown={e => e.key === 'Enter' && handleToggleTheme()}
          >
            <div className="toggle-knob" />
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <p className="section-label" style={{ marginBottom: '4px' }}>Data Lokal</p>

        <div className="settings-row">
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Habit</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Tersimpan di browser</p>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
            {stats.habits}
          </span>
        </div>

        <div className="settings-row">
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Total Check-in</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Kumulatif semua waktu</p>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
            {stats.completions}
          </span>
        </div>

        <div className="settings-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--danger)' }}>Reset Semua Data</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hapus semua habit dan riwayat</p>
          </div>
          <button
            className="btn btn-danger"
            style={{ padding: '8px 14px', fontSize: '12px' }}
            onClick={() => setShowResetConfirm(true)}
            id="reset-data-btn"
          >
            Reset
          </button>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <p className="section-label" style={{ marginBottom: '4px' }}>Tentang</p>

        <div className="settings-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-bg)', border: '1px solid var(--accent-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Info size={16} color="var(--accent)" strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Alva Track</p>
          </div>
          <span style={{
            fontSize: '11px', color: 'var(--text-muted)',
            background: 'var(--surface-soft)', border: '1px solid var(--border)',
            padding: '4px 10px', borderRadius: '20px', fontWeight: 600,
          }}>
            v1.0.0
          </span>
        </div>

        <div style={{ paddingTop: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Alva Track membantu kamu membangun kebiasaan positif secara konsisten. Data tersinkronisasi secara otomatis menggunakan Firebase Cloud Storage.
          </p>
        </div>
      </div>
      
      {/* Logout */}
      <button
        onClick={logout}
        className="btn btn-secondary"
        style={{
          width: '100%', padding: '16px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '10px', marginTop: '24px',
          color: 'var(--danger)', border: '1px solid var(--danger-border)',
          background: 'var(--danger-bg)'
        }}
      >
        <LogOut size={18} strokeWidth={2} />
        <span style={{ fontWeight: 600 }}>Keluar Akun (Logout)</span>
      </button>

      {/* Reset Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" onClick={() => setShowResetConfirm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={18} color="var(--danger)" strokeWidth={1.8} />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Reset Semua Data?
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Semua habit dan riwayat checklist akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowResetConfirm(false)}>
                Batal
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleReset} id="confirm-reset-btn">
                Ya, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
