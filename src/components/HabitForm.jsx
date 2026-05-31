import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COLORS = [
  { label: 'Hijau Neon', value: '#B6FF00' },
  { label: 'Cyan',       value: '#00D4FF' },
  { label: 'Ungu',       value: '#A855F7' },
  { label: 'Merah',      value: '#FF4D4D' },
  { label: 'Oranye',     value: '#FF8C00' },
  { label: 'Pink',       value: '#FF6B9D' },
  { label: 'Biru',       value: '#3B82F6' },
  { label: 'Putih',      value: '#F5F5F5' },
];

const INITIAL = { name: '', description: '', color: '#B6FF00' };

export default function HabitForm({ onSave, onClose, initialData = null }) {
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        color: initialData.color || '#B6FF00',
      });
    } else {
      setForm(INITIAL);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'name') setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Nama habit tidak boleh kosong');
      return;
    }
    onSave({ ...form, name: form.name.trim() });
    setForm(INITIAL);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
              {initialData ? 'Edit Habit' : 'Habit Baru'}
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {initialData ? 'Ubah detail habit kamu' : 'Tambahkan kebiasaan baru'}
            </p>
          </div>
          <button
            className="btn btn-icon btn-secondary"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nama */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-name">Nama Habit</label>
            <input
              id="habit-name"
              type="text"
              className="form-input"
              placeholder="Contoh: Olahraga pagi"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              autoFocus
            />
            {error && (
              <p style={{ fontSize: '12px', color: 'var(--danger)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {error}
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-desc">Deskripsi (opsional)</label>
            <textarea
              id="habit-desc"
              className="form-textarea"
              placeholder="Deskripsikan habit ini..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          {/* Pilih Warna */}
          <div className="form-group">
            <label className="form-label">Warna</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
              {COLORS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`color-swatch ${form.color === value ? 'selected' : ''}`}
                  style={{ background: value }}
                  onClick={() => handleChange('color', value)}
                  title={label}
                  aria-label={`Warna ${label}`}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              borderLeft: `2px solid ${form.color}`,
              background: 'var(--surface-soft)',
              border: `1px solid var(--border)`,
              borderLeftColor: form.color,
              marginBottom: '20px',
            }}
          >
            <p style={{ fontSize: '13px', fontWeight: 600, color: form.name ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {form.name || 'Nama Habit'}
            </p>
            {form.description && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {form.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2 }}
              id="habit-form-submit"
            >
              {initialData ? 'Simpan' : 'Tambah Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
