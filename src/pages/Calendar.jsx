import React, { useState, useEffect } from 'react';
import { ChevronDown, CalendarDays, Zap, TrendingUp } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import { getHabits, getCompletions } from '../services/habitService';
import { formatDisplayDate } from '../utils/dateHelper';
import { getCurrentStreak, getLongestStreak } from '../utils/calculateStreak';

export default function Calendar() {
  const [habits, setHabits]                 = useState([]);
  const [completions, setCompletions]       = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState('');
  const [selectedDate, setSelectedDate]     = useState(null);
  const [showSelector, setShowSelector]     = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [h, c] = await Promise.all([getHabits(), getCompletions()]);
      const activeHabits = h.filter(habit => habit.isActive);
      setHabits(activeHabits);
      setCompletions(c);
      if (activeHabits.length > 0) setSelectedHabitId(activeHabits[0].id);
    };
    loadData();
  }, []);

  const selectedHabit = habits.find(h => h.id === selectedHabitId);
  const currentStreak = selectedHabit ? getCurrentStreak(completions, selectedHabit.id) : 0;
  const longestStreak = selectedHabit ? getLongestStreak(completions, selectedHabit.id) : 0;

  if (habits.length === 0) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Kalender<span style={{ color: 'var(--accent)' }}>.</span></h1>
          <p>Visualisasi konsistensi kebiasaanmu</p>
        </div>
        <div className="card empty-state">
          <div className="empty-state-icon">
            <CalendarDays size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Belum ada habit
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Tambahkan habit terlebih dahulu untuk melihat kalender progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <h1>Kalender<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p>Visualisasi konsistensi kebiasaanmu</p>
      </div>

      {/* Habit Selector */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <button
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'var(--surface)',
            border: `1px solid ${selectedHabit ? selectedHabit.color + '40' : 'var(--border)'}`,
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            transition: 'var(--transition)',
          }}
          onClick={() => setShowSelector(s => !s)}
          id="habit-selector-btn"
          aria-expanded={showSelector}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {selectedHabit && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedHabit.color, flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {selectedHabit?.name || 'Pilih Habit'}
            </span>
          </div>
          <ChevronDown
            size={16}
            color="var(--text-muted)"
            style={{ transform: showSelector ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
          />
        </button>

        {showSelector && (
          <div
            className="card animate-slide-down"
            style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, zIndex: 300, padding: '8px', maxHeight: '200px', overflowY: 'auto' }}
          >
            {habits.map(h => (
              <button
                key={h.id}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: h.id === selectedHabitId ? 'var(--surface-soft)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
                onClick={() => { setSelectedHabitId(h.id); setShowSelector(false); setSelectedDate(null); }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: h.color }} />
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{h.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Streak Cards */}
      {selectedHabit && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
          {[
            { icon: Zap, label: 'Current Streak', value: currentStreak, unit: 'hari' },
            { icon: TrendingUp, label: 'Longest Streak', value: longestStreak, unit: 'hari' },
          ].map(({ icon: Icon, label, value, unit }) => (
            <div key={label} className="card" style={{ padding: '16px', borderTop: `2px solid var(--accent)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Icon size={14} color="var(--accent)" strokeWidth={2} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {label}
                </span>
              </div>
              <p style={{ fontSize: '26px', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {value}
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>{unit}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Calendar */}
      {selectedHabit && (
        <div className="card" style={{ marginBottom: '16px' }}>
          <CalendarView
            habit={selectedHabit}
            completions={completions}
            onDayClick={(date) => setSelectedDate(selectedDate === date ? null : date)}
          />
        </div>
      )}

      {/* Day Detail */}
      {selectedDate && (
        <div className="card animate-slide-down" style={{ borderTop: '2px solid var(--border)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {formatDisplayDate(selectedDate)}
          </p>
          {completions.some(c => c.habitId === selectedHabitId && c.date === selectedDate && c.completed) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>
                {selectedHabit?.name} — Selesai
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)' }} />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)' }}>
                {selectedHabit?.name} — Tidak selesai
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
