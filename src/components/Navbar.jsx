import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';

const navItems = [
  { to: '/',         icon: LayoutDashboard,   label: 'Home' },
  { to: '/habits',   icon: ListChecks,         label: 'Habit' },
  { to: '/calendar', icon: CalendarDays,       label: 'Kalender' },
  { to: '/stats',    icon: BarChart3,          label: 'Statistik' },
  { to: '/settings', icon: SlidersHorizontal, label: 'Pengaturan' },
];

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 4px 20px',
        zIndex: 200,
      }}
    >
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          {({ isActive }) => (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 0',
                transition: 'var(--transition-fast)',
              }}
            >
              {/* Pill indicator */}
              <div
                style={{
                  width: isActive ? '44px' : '36px',
                  height: '30px',
                  borderRadius: '15px',
                  background: isActive ? 'var(--accent-bg)' : 'transparent',
                  border: isActive ? '1px solid var(--accent-border)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'var(--transition)',
                  boxShadow: isActive ? '0 0 8px var(--accent-glow-soft)' : 'none',
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  color={isActive ? 'var(--accent)' : 'var(--text-muted)'}
                />
              </div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  transition: 'var(--transition-fast)',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
