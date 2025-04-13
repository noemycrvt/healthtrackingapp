
// components/MedicationNotes.tsx
import { useState } from 'react';

export function useMedicationNotes() {
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [effectiveness, setEffectiveness] = useState('');
  const [sideEffects, setSideEffects] = useState([
    'Headache',
    'Nausea',
    'Dizziness',
    'Fatigue',
  ]);

  const [newEffect, setNewEffect] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleEffect = (effect: string) => {
    setSelectedEffects((prev) =>
      prev.includes(effect)
        ? prev.filter((e) => e !== effect)
        : [...prev, effect]
    );
  };

  const addCustomEffect = () => {
    if (newEffect.trim() === '') return;
    setSideEffects((prev) => [...prev, newEffect.trim()]);
    setNewEffect('');
    setIsAdding(false);
  };

  const deleteEffect = (effectToDelete: string) => {
    setSideEffects((prev) => prev.filter((e) => e !== effectToDelete));
    setSelectedEffects((prev) => prev.filter((e) => e !== effectToDelete));
  };
  

  return {
    selectedEffects,
    toggleEffect,
    effectiveness,
    setEffectiveness,
    sideEffects,
    setSideEffects,
    newEffect,
    setNewEffect,
    isAdding,
    setIsAdding,
    addCustomEffect,
    deleteEffect,
    setSelectedEffects,
  };
}
