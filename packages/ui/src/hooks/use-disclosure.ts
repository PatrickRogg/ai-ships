'use client';

import { useCallback, useState } from 'react';

interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onOpenChange: (open: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useDisclosure = (defaultIsOpen: boolean = false): UseDisclosureReturn => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onToggle = useCallback(() => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return { isOpen, onOpen, onClose, onToggle, onOpenChange, setIsOpen };
};
