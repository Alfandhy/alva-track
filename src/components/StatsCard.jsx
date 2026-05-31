import React from 'react';

export default function StatsCard({ icon: Icon, title, value, subtitle, color = 'var(--accent)', size = 'normal' }) {
  const isSmall = size === 'small';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: isSmall ? '14px' : '18px',
        transition: 'var(--transition)',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width:  isSmall ? '40px' : '48px',
          height: isSmall ? '40px' : '48px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--surface-soft)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={isSmall ? 18 : 22} color={color} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <div style={{ minWidth: 0 }}>
        <p style={{
          fontSize: '11px',
          color: 'var(--text-muted)',
          fontWeight: 500,
          marginBottom: '3px',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
        }}>
          {title}
        </p>
        <p style={{
          fontSize: isSmall ? '18px' : '26px',
          fontWeight: 800,
          color: color,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: subtitle ? '2px' : 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
