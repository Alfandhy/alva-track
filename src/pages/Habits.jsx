import React, { useState, useEffect } from 'react';
import { Plus, ListChecks, X, AlertTriangle } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import {
  getHabits, getCompletions, addHabit, updateHabit,
  deleteHabit, toggleCompletion
} from '../services/habitService';

export default function Habits() {
  const [habits, setHabits]           = useState([]);
  const [completions, setCompletions] = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadData = () => {
    setHabits(getHabits());
    setCompletions(getCompletions());
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = (formData) => {
    if (editingHabit) updateHabit(editingHabit.id, formData);
    else addHabit(formData);
    loadData();
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDelete    = (id) => setDeleteConfirm(id);
  const confirmDelete   = () => { deleteHabit(deleteConfirm); setDeleteConfirm(null); loadData(); };

  const handleToggle = (habitId, date) => {
    toggleCompletion(habitId, date);
    setCompletions(getCompletions());
  };

  const activeHabits   = habits.filter(h => h.isActive);
  const inactiveHabits = habits.filter(h => !h.isActive);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <h1>Habit<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p>Kelola kebiasaan harianmu</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Aktif',  value: activeHabits.length,  color: 'var(--accent)' },
          { label: 'Total',  value: habits.length,         color: 'var(--text-secondary)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <p style={{ fontSize: '30px', fontWeight: 900, color, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {value}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Active */}
      {activeHabits.length > 0 && (
        <div>
          <p className="section-label">Aktif ({activeHabits.length})</p>
          {activeHabits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              completions={completions}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Inactive */}
      {inactiveHabits.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <p className="section-label">Tidak Aktif ({inactiveHabits.length})</p>
          {inactiveHabits.map(h => (
            <HabitCard
              key={h.id}
              habit={h}
              completions={completions}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {habits.length === 0 && (
        <div className="card empty-state">
          <div className="empty-state-icon">
            <ListChecks size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Belum ada habit
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Klik + untuk menambahkan habit pertama
          </p>
        </div>
      )}

      {/* FAB */}
      <button
        className="fab"
        onClick={() => { setEditingHabit(null); setShowForm(true); }}
        id="add-habit-fab"
        aria-label="Tambah habit baru"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {/* Form Modal */}
      {showForm && (
        <HabitForm
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingHabit(null); }}
          initialData={editingHabit}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
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
                  Hapus Habit?
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Habit dan seluruh riwayat completion akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>
                Batal
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={confirmDelete} id="confirm-delete-btn">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
