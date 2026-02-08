import { useMemo, useState, useCallback } from 'react';
import data from '../data/problems.json';
import type { Problem, AnkiCardWithMeta, ProblemsData } from '../types';

const typedData = data as ProblemsData;

export function useProblems() {
  const { patterns } = typedData;
  const [customProblems, setCustomProblems] = useState<Problem[]>([]);

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
    setCustomProblems(prev => [...prev.filter(p => p.id !== problem.id), problem]);
  }, []);

  const getById = (id: string): Problem | null => {
    return problems.find(p => p.id === id) || null;
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

  return { patterns, problems, getById, getByPattern, search, getPatternStats, getAllAnkiCards, addCustomProblem };
}
