import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  getMonthName,
  formatDate,
  isToday,
  isFuture,
} from '../utils/dateHelper';

export default function CalendarView({ habit, completions, onDayClick }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const completedSet = new Set(
    completions
      .filter(c => c.habitId === habit.id && c.completed)
      .map(c => c.date)
  );

  const totalDays    = getDaysInMonth(viewYear, viewMonth);
  const firstDay     = getFirstDayOfMonth(viewYear, viewMonth);
  const isCurrentMon = viewYear === now.getFullYear() && viewMonth === now.getMonth();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (isCurrentMon) return;
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const DAY_LABELS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <div>
      {/* Month Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="btn btn-icon btn-secondary" onClick={prevMonth} aria-label="Bulan sebelumnya">
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {getMonthName(viewMonth)} {viewYear}
        </span>
        <button
          className="btn btn-icon btn-secondary"
          onClick={nextMonth}
          disabled={isCurrentMon}
          style={{ opacity: isCurrentMon ? 0.25 : 1 }}
          aria-label="Bulan berikutnya"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day labels */}
      <div className="calendar-grid" style={{ marginBottom: '6px' }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.04em', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="calendar-grid">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`e-${idx}`} className="calendar-day empty" />;

          const dateStr   = formatDate(new Date(viewYear, viewMonth, day));
          const future    = isFuture(dateStr);
          const completed = completedSet.has(dateStr);
          const todayDate = isToday(dateStr);

          let cls = 'calendar-day';
          if (future)         cls += ' future';
          else if (completed) cls += ' completed';
          else                cls += ' missed';
          if (todayDate)      cls += ' today';

          return (
            <div
              key={dateStr}
              className={cls}
              onClick={() => !future && onDayClick && onDayClick(dateStr)}
              title={dateStr}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
        {[
          { color: 'var(--accent)',        label: 'Selesai',  border: false },
          { color: 'var(--surface-soft)',  label: 'Terlewat', border: false },
          { color: 'transparent',          label: 'Hari ini', border: true  },
        ].map(({ color, label, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '3px',
              background: color,
              border: border ? '1.5px solid var(--accent)' : `1px solid var(--border)`,
            }} />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
