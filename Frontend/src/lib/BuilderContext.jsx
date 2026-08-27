import { createContext, useCallback, useContext, useState } from 'react';
import { newElement } from './constants';

const BuilderContext = createContext(null);

export function BuilderProvider({ children }) {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(''), 2200);
  }, []);

  const addElement = useCallback((type, x, y) => {
    const el = newElement(type, x, y);
    setElements((prev) => [...prev, el]);
    setSelectedId(el.id);
    return el;
  }, []);

  const updateElement = useCallback((id, patch) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const updateStyle = useCallback((id, patch) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, styles: { ...e.styles, ...patch } } : e)));
  }, []);

  const updateAnimation = useCallback((id, patch) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, animation: { ...e.animation, ...patch } } : e)));
  }, []);

  const deleteElement = useCallback((id) => {
    setElements((prev) => prev.filter((e) => e.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const moveLayer = useCallback((id, dir) => {
    setElements((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      const swap = idx + dir;
      if (idx === -1 || swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }, []);

  const loadElements = useCallback((els) => {
    setElements(els);
    setSelectedId(null);
  }, []);

  const resetCanvas = useCallback(() => {
    setElements([]);
    setSelectedId(null);
  }, []);

  const value = {
    elements, setElements,
    selectedId, setSelectedId,
    addElement, updateElement, updateStyle, updateAnimation,
    deleteElement, moveLayer, loadElements, resetCanvas,
    toast, showToast,
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>');
  return ctx;
}
