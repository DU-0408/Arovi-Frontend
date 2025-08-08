import React, { useState, useEffect } from 'react';
import { Language, getTranslation } from './languages';
import { DarkModePreference } from './utils/darkMode';

interface SettingsProps {
  isVisible: boolean;
  onClose: () => void;
  currentLanguage: Language;
  currentEmail: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (currentPassword: string, newPassword: string) => void;
  darkModePreference: DarkModePreference;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
}

const Settings: React.FC<SettingsProps> = ({
  isVisible,
  onClose,
  currentLanguage,
  currentEmail,
  onEmailChange,
  onPasswordChange,
  darkModePreference,
  isDarkMode,
  onDarkModeToggle
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'email' | 'password'>('appearance');
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const t = (key: string) => getTranslation(currentLanguage.code, key);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  const handleEmailSave = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onEmailChange(newEmail);
      setMessage(t('settingsSaved'));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSave = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onPasswordChange(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage(t('settingsSaved'));
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ {t('settings')}</h2>
          <button className="settings-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            🎨 {t('appearance')}
          </button>
          <button
            className={`settings-tab ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => setActiveTab('email')}
          >
            📧 {t('email')}
          </button>
          <button
            className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 {t('password')}
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <h3>{t('appearance')}</h3>
              <div className="appearance-options">
                <div className="theme-toggle">
                  <div className="theme-info">
                    <div className="theme-name">
                      {darkModePreference === 'system' ? 'System' : 
                       darkModePreference === 'light' ? t('lightMode') : t('darkMode')}
                    </div>
                    <div className="theme-description">
                      {darkModePreference === 'system' ? 'Follows your system preference' :
                       darkModePreference === 'light' ? 'Always use light mode' : 'Always use dark mode'}
                    </div>
                  </div>
                  <button
                    className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
                    onClick={onDarkModeToggle}
                  >
                    <div className="toggle-slider"></div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="settings-section">
              <h3>{t('changeEmail')}</h3>
              <div className="form-group">
                <label>{t('email')}</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                />
              </div>
              <div className="settings-actions">
                <button
                  className="settings-save-btn"
                  onClick={handleEmailSave}
                  disabled={isLoading || !newEmail}
                >
                  {isLoading ? 'Saving...' : t('save')}
                </button>
                <button className="settings-cancel-btn" onClick={onClose}>
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="settings-section">
              <h3>{t('changePassword')}</h3>
              <div className="form-group">
                <label>{t('currentPassword')}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>{t('newPassword')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="form-group">
                <label>{t('confirmPassword')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <div className="settings-actions">
                <button
                  className="settings-save-btn"
                  onClick={handlePasswordSave}
                  disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                >
                  {isLoading ? 'Saving...' : t('save')}
                </button>
                <button className="settings-cancel-btn" onClick={onClose}>
                  {t('cancel')}
                </button>
              </div>
            </div>
          )}
        </div>

        {message && (
          <div className={`settings-message ${message.includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 