import { db, auth } from './firebase';
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

// Helper untuk mendapatkan references
const getRefs = () => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");
  
  return {
    userRef: doc(db, 'users', userId),
    habitsRef: collection(db, 'users', userId, 'habits'),
    completionsRef: collection(db, 'users', userId, 'completions')
  };
};

// ─── Habits ─────────────────────────────────────────────────

export async function getHabits() {
  try {
    const { habitsRef } = getRefs();
    const snapshot = await getDocs(habitsRef);
    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function addHabit(habit) {
  const { habitsRef } = getRefs();
  const newId = `habit_${Date.now()}`;
  const newHabit = {
    id: newId,
    name: habit.name,
    description: habit.description || '',
    color: habit.color || '#B6FF00',
    createdAt: new Date().toISOString().split('T')[0],
    isActive: true,
  };
  
  await setDoc(doc(habitsRef, newId), newHabit);
  return newHabit;
}

export async function updateHabit(id, data) {
  const { habitsRef } = getRefs();
  const habitDoc = doc(habitsRef, id);
  const snap = await getDoc(habitDoc);
  if (snap.exists()) {
    const updated = { ...snap.data(), ...data };
    await setDoc(habitDoc, updated);
    return updated;
  }
  return null;
}

export async function deleteHabit(id) {
  const { habitsRef, completionsRef } = getRefs();
  
  // Delete habit
  await deleteDoc(doc(habitsRef, id));
  
  // Delete all completions for this habit
  const compSnap = await getDocs(completionsRef);
  const batch = writeBatch(db);
  compSnap.docs.forEach(docSnap => {
    if (docSnap.data().habitId === id) {
      batch.delete(docSnap.ref);
    }
  });
  await batch.commit();
}

export async function toggleHabitActive(id) {
  const { habitsRef } = getRefs();
  const habitDoc = doc(habitsRef, id);
  const snap = await getDoc(habitDoc);
  if (snap.exists()) {
    const current = snap.data();
    const updated = { ...current, isActive: !current.isActive };
    await setDoc(habitDoc, updated);
    return updated;
  }
  return null;
}

// ─── Completions ─────────────────────────────────────────────

export async function getCompletions() {
  try {
    const { completionsRef } = getRefs();
    const snapshot = await getDocs(completionsRef);
    return snapshot.docs.map(doc => doc.data());
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function toggleCompletion(habitId, date) {
  const { completionsRef } = getRefs();
  const compId = `${habitId}_${date}`;
  const compDoc = doc(completionsRef, compId);
  
  const snap = await getDoc(compDoc);
  if (snap.exists()) {
    const current = snap.data();
    await setDoc(compDoc, { ...current, completed: !current.completed });
    return !current.completed;
  } else {
    await setDoc(compDoc, {
      id: compId,
      habitId,
      date,
      completed: true
    });
    return true;
  }
}

// ─── User ────────────────────────────────────────────────────

export async function getUser() {
  try {
    const { userRef } = getRefs();
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    // Return default if not exists
    return { name: auth.currentUser?.displayName || 'Alva', theme: 'dark' };
  } catch (err) {
    return { name: 'Alva', theme: 'dark' };
  }
}

export async function saveUser(userData) {
  const { userRef } = getRefs();
  const current = await getUser();
  await setDoc(userRef, { ...current, ...userData });
}

export async function resetAllData() {
  const { habitsRef, completionsRef } = getRefs();
  const batch = writeBatch(db);
  
  const habitsSnap = await getDocs(habitsRef);
  habitsSnap.docs.forEach(d => batch.delete(d.ref));
  
  const compSnap = await getDocs(completionsRef);
  compSnap.docs.forEach(d => batch.delete(d.ref));
  
  await batch.commit();
}
