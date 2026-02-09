import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const LOCAL_NOTES_KEY = 'dsa-prep-notes';

function loadLocalNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(LOCAL_NOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalNotes(all: Record<string, string>) {
  localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(all));
}

export function useNotes(problemId: string | undefined) {
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load notes when problem changes
  useEffect(() => {
    if (!problemId) return;

    if (user) {
      // Signed in: load from Supabase
      supabase
        .from('user_notes')
        .select('notes')
        .eq('user_id', user.id)
        .eq('problem_id', problemId)
        .single()
        .then(({ data }) => {
          setNotes(data?.notes || '');
        });
    } else {
      // Guest: load from localStorage
      const all = loadLocalNotes();
      setNotes(all[problemId] || '');
    }
  }, [user, problemId]);

  const saveNotes = useCallback((value: string) => {
    setNotes(value);
    if (!problemId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (user) {
        // Signed in: save to Supabase
        supabase.from('user_notes').upsert({
          user_id: user.id,
          problem_id: problemId,
          notes: value,
          updated_at: new Date().toISOString(),
        }).then();
      } else {
        // Guest: save to localStorage
        const all = loadLocalNotes();
        all[problemId] = value;
        saveLocalNotes(all);
      }
    }, 500);
  }, [user, problemId]);

  return { notes, saveNotes };
}
