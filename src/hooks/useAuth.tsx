
import { useState } from 'react';

export const useAuth = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = (password: string) => {
    if (password === 'mividitayyo97') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminMode(false);
  };

  const toggleAdminMode = () => {
    if (!isAdminMode) {
      setShowLoginModal(true);
    } else {
      logout();
    }
  };

  return {
    isAdminMode,
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    toggleAdminMode
  };
};
