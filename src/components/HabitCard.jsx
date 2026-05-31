import React from 'react';
import { Pencil, Trash2, Check, Zap } from 'lucide-react';
import { getTodayStr } from '../utils/dateHelper';
import { getCurrentStreak } from '../utils/calculateStreak';

export default function HabitCard({ habit, completions, onToggle, onEdit, onDelete }) {
  const today = getTodayStr();
  const isCompleted = completions.some(
    c => c.habitId === habit.id && c.date === today && c.completed
  );
  const streak = getCurrentStreak(completions, habit.id);

  return (
    <div
      className="card animate-pop"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '15px 16px',
        marginBottom: '10px',
        borderLeft: `2px solid ${isCompleted ? 'var(--accent)' : habit.color}`,
        background: isCompleted ? 'rgba(182,255,0,0.03)' : 'var(--surface)',
        transition: 'var(--transition)',
      }}
    >
      {/* Checkbox */}
      <div
        className={`habit-checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(habit.id, today)}
        role="checkbox"
        aria-checked={isCompleted}
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && onToggle(habit.id, today)}
      >
        {isCompleted && (
          <Check size={13} strokeWidth={3} color="var(--text-on-accent)" />
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
              textDecoration: isCompleted ? 'line-through' : 'none',
              transition: 'var(--transition)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {habit.name}
          </span>

          {/* Streak badge — no emoji */}
          {streak > 0 && (
            <span className="badge badge-streak">
              <Zap size={9} strokeWidth={2.5} />
              {streak}
            </span>
          )}
        </div>

        {habit.description && (
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {habit.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
        <button
          className="btn btn-icon btn-secondary"
          onClick={() => onEdit(habit)}
          aria-label={`Edit ${habit.name}`}
        >
          <Pencil size={13} color="var(--text-secondary)" />
        </button>
        <button
          className="btn btn-icon btn-danger"
          onClick={() => onDelete(habit.id)}
          aria-label={`Hapus ${habit.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
