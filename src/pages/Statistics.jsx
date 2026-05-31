import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { BarChart3, TrendingUp, CheckCircle2, Award, Zap } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { getHabits, getCompletions } from '../services/habitService';
import { getLast7Days, getShortDayName } from '../utils/dateHelper';
import { getCompletionRate, getBestHabit, getBestDay } from '../utils/calculateStreak';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface-soft)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
      }}>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
          {label}
        </p>
        <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
          {payload[0].value}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '4px' }}>habit</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Statistics() {
  const [habits, setHabits]           = useState([]);
  const [completions, setCompletions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [h, c] = await Promise.all([getHabits(), getCompletions()]);
      setHabits(h.filter(habit => habit.isActive));
      setCompletions(c);
    };
    loadData();
  }, []);

  const last7     = getLast7Days();
  const chartData = last7.map(date => ({
    day:   getShortDayName(date),
    date,
    count: completions.filter(c => c.date === date && c.completed).length,
  }));

  const totalThisWeek  = chartData.reduce((sum, d) => sum + d.count, 0);
  const maxPossible    = habits.length * 7;
  const consistencyPct = maxPossible > 0 ? Math.round((totalThisWeek / maxPossible) * 100) : 0;
  const bestHabit      = getBestHabit(habits, completions);
  const bestDay        = getBestDay(completions);

  const habitRates = habits
    .map(h => ({
      ...h,
      rate:  getCompletionRate(completions, h.id, 7),
      count: last7.filter(d => completions.some(c => c.habitId === h.id && c.date === d && c.completed)).length,
    }))
    .sort((a, b) => b.rate - a.rate);

  if (habits.length === 0) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Statistik<span style={{ color: 'var(--accent)' }}>.</span></h1>
          <p>Analisis kebiasaanmu</p>
        </div>
        <div className="card empty-state">
          <div className="empty-state-icon">
            <BarChart3 size={24} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Belum ada data
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Tambahkan habit dan mulai checklist untuk melihat statistik.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* Header */}
      <div className="page-header">
        <h1>Statistik<span style={{ color: 'var(--accent)' }}>.</span></h1>
        <p>Analisis 7 hari terakhir</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <StatsCard
          icon={CheckCircle2}
          title="Total Selesai"
          value={totalThisWeek}
          subtitle="minggu ini"
          color="var(--accent)"
          size="small"
        />
        <StatsCard
          icon={TrendingUp}
          title="Konsistensi"
          value={`${consistencyPct}%`}
          subtitle="7 hari terakhir"
          color="var(--accent)"
          size="small"
        />
        <StatsCard
          icon={Award}
          title="Habit Terbaik"
          value={bestHabit ? bestHabit.name.slice(0, 10) : '—'}
          subtitle={bestHabit ? `${getCompletionRate(completions, bestHabit.id, 7)}% konsisten` : ''}
          color="var(--text-secondary)"
          size="small"
        />
        <StatsCard
          icon={Zap}
          title="Hari Terbaik"
          value={bestDay}
          subtitle="paling produktif"
          color="var(--text-secondary)"
          size="small"
        />
      </div>

      {/* Bar Chart */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <p className="section-label" style={{ marginBottom: '2px' }}>Habit Selesai per Hari</p>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>7 hari terakhir</p>
          </div>
          <BarChart3 size={16} color="var(--text-muted)" strokeWidth={1.5} />
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 0" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Inter', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-soft)', radius: 4 }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {chartData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={entry.count > 0 ? '#B6FF00' : 'var(--surface-soft)'}
                  opacity={entry.count > 0 ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Habit Ranking */}
      <div className="card">
        <p className="section-label" style={{ marginBottom: '16px' }}>Ranking Habit (7 Hari)</p>
        {habitRates.map((h, idx) => (
          <div key={h.id} style={{ marginBottom: idx < habitRates.length - 1 ? '16px' : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '7px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', width: '14px', letterSpacing: '-0.01em' }}>
                  {idx + 1}
                </span>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: h.color }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {h.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{h.count}/7</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: h.rate > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {h.rate}%
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${h.rate}%`,
                  background: h.rate > 0 ? 'var(--accent)' : 'var(--border)',
                  boxShadow: h.rate > 0 ? '0 0 6px var(--accent-glow-soft)' : 'none',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
