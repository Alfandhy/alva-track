import React, { useState, useEffect } from 'react';
import { Check, Zap, Target, ArrowRight } from 'lucide-react';
import { getHabits, getCompletions, toggleCompletion, getUser } from '../services/habitService';
import { getTodayStr, formatDisplayDate } from '../utils/dateHelper';
import { getCurrentStreak } from '../utils/calculateStreak';

export default function Dashboard() {
  const [habits, setHabits]       = useState([]);
  const [completions, setCompletions] = useState([]);
  const [user, setUser]           = useState({ name: 'Alva' });

  const today = getTodayStr();

  const loadData = async () => {
    const [h, c, u] = await Promise.all([
      getHabits(),
      getCompletions(),
      getUser()
    ]);
    setHabits(h.filter(habit => habit.isActive));
    setCompletions(c);
    setUser(u);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('focus', loadData);
    return () => window.removeEventListener('focus', loadData);
  }, []);

  const handleToggle = async (habitId) => {
    // Optimistic UI update
    setCompletions(prev => {
      const exists = prev.find(c => c.habitId === habitId && c.date === today);
      if (exists) {
        return prev.map(c => c === exists ? { ...c, completed: !c.completed } : c);
      }
      return [...prev, { habitId, date: today, completed: true }];
    });
    
    // Background sync
    await toggleCompletion(habitId, today);
    const newCompletions = await getCompletions();
    setCompletions(newCompletions);
  };

  const isCompleted = (habitId) =>
    completions.some(c => c.habitId === habitId && c.date === today && c.completed);

  const completedCount = habits.filter(h => isCompleted(h.id)).length;
  const totalCount     = habits.length;
  const progressPct    = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const topHabits = [...habits]
    .map(h => ({ ...h, streak: getCurrentStreak(completions, h.id) }))
    .filter(h => h.streak > 0)
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 3);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Selamat pagi';
    if (h < 15) return 'Selamat siang';
    if (h < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  return (
    <div className="page-content">

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 500 }}>
          {getGreeting()}
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {user.name || 'Alva'}
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {formatDisplayDate(today)}
        </p>
      </div>

      {/* Progress Card */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Accent line top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, var(--accent) ${progressPct}%, var(--border) ${progressPct}%)`,
          transition: 'background 0.6s ease',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target size={14} color="var(--text-muted)" strokeWidth={1.8} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Progress Hari Ini
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {completedCount}
          </span>
          <span style={{ fontSize: '20px', color: 'var(--text-muted)', fontWeight: 400 }}>/ {totalCount}</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '4px' }}>selesai</span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <p style={{ fontSize: '12px', color: progressPct === 100 ? 'var(--accent)' : 'var(--text-muted)', marginTop: '10px', fontWeight: progressPct === 100 ? 600 : 400 }}>
          {progressPct === 100
            ? 'Sempurna — semua habit selesai hari ini'
            : totalCount === 0
            ? 'Belum ada habit — tambahkan di tab Habit'
            : `${progressPct}% — terus semangat`}
        </p>
      </div>

      {/* Streak Highlights */}
      {topHabits.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <p className="section-label">Streak Aktif</p>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            {topHabits.map(h => (
              <div
                key={h.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderTop: `2px solid ${h.color}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                  minWidth: '108px',
                  textAlign: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '4px' }}>
                  <Zap size={13} color="var(--accent)" strokeWidth={2} />
                  <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em' }}>
                    {h.streak}
                  </span>
                </div>
                <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {h.name}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>hari berturut</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      <div>
        <p className="section-label">Checklist Hari Ini</p>

        {habits.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">
              <Target size={24} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Belum ada habit
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Tambahkan habit pertama di tab Habit
            </p>
          </div>
        ) : (
          habits.map(habit => {
            const done   = isCompleted(habit.id);
            const streak = getCurrentStreak(completions, habit.id);
            return (
              <div
                key={habit.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderLeft: `2px solid ${done ? 'var(--accent)' : habit.color}`,
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  background: done ? 'rgba(182,255,0,0.03)' : 'var(--surface)',
                }}
                onClick={() => handleToggle(habit.id)}
                role="checkbox"
                aria-checked={done}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleToggle(habit.id)}
              >
                {/* Checkbox */}
                <div
                  className={`habit-checkbox ${done ? 'checked' : ''}`}
                  style={{ pointerEvents: 'none' }}
                >
                  {done && <Check size={13} strokeWidth={3} color="var(--text-on-accent)" />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: done ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: done ? 'line-through' : 'none',
                      transition: 'var(--transition)',
                    }}>
                      {habit.name}
                    </span>
                    {streak > 0 && (
                      <span className="badge badge-streak">
                        <Zap size={9} strokeWidth={2.5} /> {streak}
                      </span>
                    )}
                  </div>
                  {habit.description && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {habit.description}
                    </p>
                  )}
                </div>

                {/* Status */}
                {done && (
                  <span className="badge badge-success">
                    <Check size={10} strokeWidth={3} /> Selesai
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
