import React, { useEffect } from 'react';
import { languages, Language } from './languages';

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
  isVisible: boolean;
  onClose?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageSelect, isVisible, onClose }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="language-selector-overlay" onClick={onClose}>
      <div className="language-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="language-selector-header">
          <h2>🌍 Select Your Language</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>
        
        <div className="language-grid">
          {languages.map((language) => (
            <button
              key={language.code}
              className="language-option"
              onClick={() => onLanguageSelect(language)}
            >
              <div className="language-info">
                <div className="language-name">{language.name}</div>
                <div className="language-native">{language.nativeName}</div>
              </div>
              <div className="language-arrow">→</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector; 