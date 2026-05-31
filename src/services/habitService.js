// ============================================================
// habitService.js — LocalStorage CRUD for habits & completions
// ============================================================

const HABITS_KEY = 'alva_track_habits';
const COMPLETIONS_KEY = 'alva_track_completions';
const USER_KEY = 'alva_track_user';

// ─── Habits ─────────────────────────────────────────────────

export function getHabits() {
  try {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function addHabit(habit) {
  const habits = getHabits();
  const newHabit = {
    id: `habit_${Date.now()}`,
    name: habit.name,
    description: habit.description || '',
    color: habit.color || '#7c3aed',
    createdAt: new Date().toISOString().split('T')[0],
    isActive: true,
  };
  habits.push(newHabit);
  saveHabits(habits);
  return newHabit;
}

export function updateHabit(id, data) {
  const habits = getHabits();
  const idx = habits.findIndex(h => h.id === id);
  if (idx !== -1) {
    habits[idx] = { ...habits[idx], ...data };
    saveHabits(habits);
    return habits[idx];
  }
  return null;
}

export function deleteHabit(id) {
  const habits = getHabits().filter(h => h.id !== id);
  saveHabits(habits);
  // Also remove all completions for this habit
  const completions = getCompletions().filter(c => c.habitId !== id);
  saveCompletions(completions);
}

export function toggleHabitActive(id) {
  const habits = getHabits();
  const idx = habits.findIndex(h => h.id === id);
  if (idx !== -1) {
    habits[idx].isActive = !habits[idx].isActive;
    saveHabits(habits);
    return habits[idx];
  }
  return null;
}

// ─── Completions ─────────────────────────────────────────────

export function getCompletions() {
  try {
    const data = localStorage.getItem(COMPLETIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCompletions(completions) {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

export function isCompleted(habitId, date) {
  const completions = getCompletions();
  return completions.some(c => c.habitId === habitId && c.date === date && c.completed);
}

export function toggleCompletion(habitId, date) {
  const completions = getCompletions();
  const existing = completions.find(c => c.habitId === habitId && c.date === date);

  if (existing) {
    // Toggle the existing completion
    existing.completed = !existing.completed;
  } else {
    // Create new completion
    completions.push({
      id: `comp_${Date.now()}`,
      habitId,
      date,
      completed: true,
    });
  }

  saveCompletions(completions);
  return !existing ? true : existing.completed;
}

// ─── User ────────────────────────────────────────────────────

export function getUser() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : { name: 'Alva', theme: 'light' };
  } catch {
    return { name: 'Alva', theme: 'light' };
  }
}

export function saveUser(userData) {
  const current = getUser();
  localStorage.setItem(USER_KEY, JSON.stringify({ ...current, ...userData }));
}

// ─── Reset ───────────────────────────────────────────────────

export function resetAllData() {
  localStorage.removeItem(HABITS_KEY);
  localStorage.removeItem(COMPLETIONS_KEY);
}
