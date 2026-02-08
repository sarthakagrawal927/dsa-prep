import { useMemo, useCallback, useSyncExternalStore, useEffect } from 'react';
import data from '../data/problems.json';
import type { Problem, AnkiCardWithMeta, ProblemsData } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const typedData = data as ProblemsData;

// Shared module-level store so custom problems persist across all components
let customProblemsStore: Problem[] = [];
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot() {
  return customProblemsStore;
}

function setStore(problems: Problem[]) {
  customProblemsStore = problems;
  listeners.forEach(cb => cb());
}

function addToStore(problem: Problem) {
  customProblemsStore = [...customProblemsStore.filter(p => p.id !== problem.id), problem];
  listeners.forEach(cb => cb());
}

export function useProblems() {
  const { patterns } = typedData;
  const { user } = useAuth();
  const customProblems = useSyncExternalStore(subscribe, getSnapshot);

  // Load imported problems from Supabase on mount
  useEffect(() => {
    if (!user) return;
    supabase
      .from('user_imported_problems')
      .select('problem_id, problem_data')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const problems = data.map(row => row.problem_data as Problem);
          setStore(problems);
        }
      });
  }, [user]);

  const problems = useMemo(() => {
    const builtIn = typedData.problems;
    const seen = new Set(builtIn.map(p => p.id));
    const merged = [...builtIn];
    for (const cp of customProblems) {
      if (!seen.has(cp.id)) {
        merged.push(cp);
        seen.add(cp.id);
      }
    }
    return merged;
  }, [customProblems]);

  const addCustomProblem = useCallback((problem: Problem) => {
    addToStore(problem);
    // Persist to Supabase
    if (user) {
      supabase.from('user_imported_problems').upsert({
        user_id: user.id,
        problem_id: problem.id,
        problem_data: problem,
      }).then();
    }
  }, [user]);

  const getById = (id: string): Problem | null => {
    return problems.find(p => p.id === id) || null;
  };

  const getBySlug = (slug: string): Problem | null => {
    return problems.find(p =>
      p.id === slug ||
      p.leetcodeUrl?.includes(`/problems/${slug}/`) ||
      p.leetcodeUrl?.includes(`/problems/${slug}`)
    ) || null;
  };

  const getByPattern = (patternId: string): Problem[] => {
    return problems.filter(p => p.pattern === patternId);
  };

  const search = (query: string): Problem[] => {
    if (!query) return problems;
    const q = query.toLowerCase();
    return problems.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.pattern.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q)
    );
  };

  const getPatternStats = useMemo(() => {
    const stats: Record<string, { total: number; problems: Problem[] }> = {};
    for (const pattern of patterns) {
      const patternProblems = problems.filter(p => p.pattern === pattern.id);
      stats[pattern.id] = { total: patternProblems.length, problems: patternProblems };
    }
    return stats;
  }, [problems, patterns]);

  const getAllAnkiCards = (): AnkiCardWithMeta[] => {
    const cards: AnkiCardWithMeta[] = [];
    for (const problem of problems) {
      if (problem.ankiCards) {
        for (const card of problem.ankiCards) {
          cards.push({
            ...card,
            problemId: problem.id,
            problemTitle: problem.title,
            pattern: problem.pattern,
          });
        }
      }
    }
    return cards;
  };

  return { patterns, problems, getById, getBySlug, getByPattern, search, getPatternStats, getAllAnkiCards, addCustomProblem };
}
