import React, { useEffect } from 'react';
import { languages, Language } from './languages';

interface LanguageSelectorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: Language) => void;
  currentLanguage: Language;
}

const LanguageSelectorPopup: React.FC<LanguageSelectorPopupProps> = ({
  isOpen,
  onClose,
  onLanguageSelect,
  currentLanguage
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="language-popup-overlay" onClick={onClose}>
      <div className="language-popup" onClick={(e) => e.stopPropagation()}>
        <div className="language-popup-header">
          <h3>Select Language</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="language-popup-content">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-option ${language.code === currentLanguage.code ? 'selected' : ''}`}
              onClick={() => {
                onLanguageSelect(language);
                onClose();
              }}
            >
              <span className="language-native-name">{language.nativeName}</span>
              <span className="language-english-name">({language.name})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorPopup; 