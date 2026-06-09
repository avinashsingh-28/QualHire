import { useState, useCallback } from 'react';

/**
 * useModal - controls open/close state for a Modal
 * @returns {{ isOpen, open, close, toggle }}
 */
const useModal = (initialOpen = false) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  return { isOpen, open, close, toggle };
};

export default useModal;
