import { useMemo, useState, useCallback } from 'react';
import data from '../data/problems.json';

const CUSTOM_KEY = 'dsa-prep-custom-problems';

function loadCustomProblems() {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useProblems() {
  const { patterns } = data;
  const [customProblems, setCustomProblems] = useState(loadCustomProblems);

  // Merge built-in + custom, custom overrides by id
  const problems = useMemo(() => {
    const builtIn = data.problems;
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

  const addCustomProblem = useCallback((problem) => {
    setCustomProblems(prev => {
      const next = [...prev.filter(p => p.id !== problem.id), problem];
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const removeCustomProblem = useCallback((id) => {
    setCustomProblems(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getById = (id) => {
    return problems.find(p => p.id === id) || null;
  };

  const getByPattern = (patternId) => {
    return problems.filter(p => p.pattern === patternId);
  };

  const search = (query) => {
    if (!query) return problems;
    const q = query.toLowerCase();
    return problems.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.pattern.toLowerCase().includes(q) ||
      p.difficulty.toLowerCase().includes(q)
    );
  };

  const getPatternStats = useMemo(() => {
    const stats = {};
    for (const pattern of patterns) {
      const patternProblems = problems.filter(p => p.pattern === pattern.id);
      stats[pattern.id] = {
        total: patternProblems.length,
        problems: patternProblems,
      };
    }
    return stats;
  }, [problems, patterns]);

  const getAllAnkiCards = () => {
    const cards = [];
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

  return {
    patterns,
    problems,
    getById,
    getByPattern,
    search,
    getPatternStats,
    getAllAnkiCards,
    addCustomProblem,
    removeCustomProblem,
    customProblems,
  };
}
