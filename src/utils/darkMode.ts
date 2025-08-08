export type DarkModePreference = 'system' | 'light' | 'dark';

export const detectSystemDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const getEffectiveDarkMode = (preference: DarkModePreference): boolean => {
  if (preference === 'system') {
    return detectSystemDarkMode();
  }
  return preference === 'dark';
};

export const subscribeToSystemDarkMode = (callback: (isDark: boolean) => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => {
    mediaQuery.removeEventListener('change', handleChange);
  };
}; 