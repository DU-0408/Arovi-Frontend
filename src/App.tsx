import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import LanguageSelector from './LanguageSelector';
import Settings from './Settings';
import { languages, Language, getTranslation } from './languages';
import { DarkModePreference, getEffectiveDarkMode, subscribeToSystemDarkMode } from './utils/darkMode';
import './App.css';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  isPrescription?: boolean;
}

interface ChatSession {
  id: number;
  session_name: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface User {
  id: number;
  email: string;
  full_name: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]); // Default to English
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [patientAge, setPatientAge] = useState('');
  const [patientConditions, setPatientConditions] = useState('');
  const [isPrescriptionLoading, setIsPrescriptionLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; sessionId: number | null } | null>(null);
  const [darkModePreference, setDarkModePreference] = useState<DarkModePreference>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Configure axios defaults and interceptors
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Set axios base URL from environment variable
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    axios.defaults.baseURL = apiBaseUrl;
    
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      fetchUserInfo();
      fetchChatSessions();
    }
    
    // Add response interceptor to handle 401 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_info');
          delete axios.defaults.headers.common['Authorization'];
          setIsAuthenticated(false);
          setUser(null);
          setMessages([]);
          setChatSessions([]);
          setCurrentSessionId(null);
        }
        return Promise.reject(error);
      }
    );
    
    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Initialize language - always default to English for login page
  useEffect(() => {
    if (isAuthenticated) {
      // For authenticated users, we'll load their preference in fetchUserInfo
      // This prevents race conditions between localStorage and backend data
    } else {
      // For login page, always default to English
      setCurrentLanguage(languages[0]); // English is the first language
    }
  }, [isAuthenticated]);

  // Initialize dark mode
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAuthenticated) {
      // For authenticated users, fetch their preference from backend
      fetchUserDarkModePreference();
    } else {
      // For non-authenticated users, use system preference
      const effectiveDarkMode = getEffectiveDarkMode('system');
      setIsDarkMode(effectiveDarkMode);
    }
  }, [isAuthenticated]);

  // Subscribe to system dark mode changes
  useEffect(() => {
    if (!isAuthenticated || darkModePreference === 'system') {
      const unsubscribe = subscribeToSystemDarkMode((isDark) => {
        if (!isAuthenticated || darkModePreference === 'system') {
          setIsDarkMode(isDark);
        }
      });
      
      return unsubscribe;
    }
  }, [isAuthenticated, darkModePreference]);

  const fetchUserInfo = async () => {
    try {
      // For now, we'll get user info from the login response
      // In a real app, you'd have a /me endpoint
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
      
      // Fetch user's language preference from backend
      try {
        const response = await axios.get('/user/language');
        const { language } = response.data;
        
        // Update current language based on user preference
        const userLanguage = languages.find(lang => lang.code === language);
        if (userLanguage) {
          setCurrentLanguage(userLanguage);
          localStorage.setItem('user_language', language);
        } else if (isNewUser) {
          // Only show language selector for new users if no language preference is set
          setShowLanguageSelector(true);
        }
      } catch (error: any) {
        console.error('Error fetching user language preference:', error);
        
        // If it's an authentication error, clear the token and redirect to login
        if (error.response?.status === 401) {
          handleLogout();
          return;
        }
        
        // Fall back to stored language preference
        const savedLanguage = localStorage.getItem('user_language');
        if (savedLanguage) {
          const language = languages.find(lang => lang.code === savedLanguage);
          if (language) {
            setCurrentLanguage(language);
          } else if (isNewUser) {
            // Only show language selector for new users if no valid language preference found
            setShowLanguageSelector(true);
          }
        } else if (isNewUser) {
          // Only show language selector for new users if no language preference at all
          setShowLanguageSelector(true);
        }
      }
      
      // Fetch user's dark mode preference from backend
      await fetchUserDarkModePreference();
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchChatSessions = async () => {
    try {
      const response = await axios.get('/chat/sessions');
      setChatSessions(response.data);
    } catch (error: any) {
      console.error('Error fetching chat sessions:', error);
      
      // If it's an authentication error, clear the token and redirect to login
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
    }
  };

  const fetchUserDarkModePreference = async () => {
    try {
      const response = await axios.get('/user/dark-mode');
      const { dark_mode } = response.data;
      
      setDarkModePreference(dark_mode as DarkModePreference);
      const effectiveDarkMode = getEffectiveDarkMode(dark_mode as DarkModePreference);
      setIsDarkMode(effectiveDarkMode);
    } catch (error: any) {
      console.error('Error fetching user dark mode preference:', error);
      
      // If it's an authentication error, clear the token and redirect to login
      if (error.response?.status === 401) {
        handleLogout();
        return;
      }
      
      // Fall back to system preference
      setDarkModePreference('system');
      const effectiveDarkMode = getEffectiveDarkMode('system');
      setIsDarkMode(effectiveDarkMode);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoginLoading(true);
    setLoginError('');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios.post('/auth/login', formData);
      
      const { access_token, user: userInfo } = response.data;
      
      // Store token and user info
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setIsAuthenticated(true);
      setUser(userInfo);
      setLoginError('');
      
      // Reset new user flag for existing users
      setIsNewUser(false);
      
      // Fetch user's language preference and chat sessions
      await fetchUserInfo();
      await fetchChatSessions();
      
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.response?.data?.detail || 'Login failed. Please try again.');
    }
    
    setIsLoginLoading(false);
  };

  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsRegisterLoading(true);
    setRegisterError('');
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('full_name', fullName);

      const response = await axios.post('/auth/register', formData);
      
      const { access_token, user: userInfo } = response.data;
      
      // Store token and user info
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setIsAuthenticated(true);
      setUser(userInfo);
      setRegisterError('');
      setShowRegister(false);
      
      // Mark as new user
      setIsNewUser(true);
      
      // Fetch user's language preference and chat sessions
      await fetchUserInfo();
      await fetchChatSessions();
      
      // Show language selector for new users
      setShowLanguageSelector(true);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterError(error.response?.data?.detail || 'Registration failed. Please try again.');
    }
    
    setIsRegisterLoading(false);
  };

  const handleLanguageSelect = async (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('user_language', language.code);
    
    // Save language preference to backend if user is authenticated
    if (isAuthenticated && user) {
      try {
        const formData = new FormData();
        formData.append('language', language.code);
        await axios.put('/user/language', formData);
        
        // Refresh user info to ensure language preference is updated
        await fetchUserInfo();
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
    
    setShowLanguageSelector(false);
    setIsNewUser(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLanguageChange = async (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('user_language', language.code);
    
    // Save language preference to backend if user is authenticated
    if (isAuthenticated && user) {
      try {
        const formData = new FormData();
        formData.append('language', language.code);
        await axios.put('/user/language', formData);
        
        // Refresh user info to ensure language preference is updated
        await fetchUserInfo();
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
  };

  const handleLoginPageLanguageChange = (language: Language) => {
    // For login page, only update the current language without saving to backend
    setCurrentLanguage(language);
    // Don't save to localStorage or backend for login page changes
  };

  const handleDarkModeToggle = async () => {
    // Cycle through: system -> light -> dark -> system
    const newPreference: DarkModePreference = 
      darkModePreference === 'system' ? 'light' :
      darkModePreference === 'light' ? 'dark' : 'system';
    
    setDarkModePreference(newPreference);
    const effectiveDarkMode = getEffectiveDarkMode(newPreference);
    setIsDarkMode(effectiveDarkMode);
    
    // Save to backend if user is authenticated
    if (isAuthenticated && user) {
      try {
        const formData = new FormData();
        formData.append('dark_mode', newPreference);
        await axios.put('/user/dark-mode', formData);
      } catch (error) {
        console.error('Error saving dark mode preference:', error);
      }
    }
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleEmailChange = (newEmail: string) => {
    // Update user email (in a real app, this would call an API)
    if (user) {
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      localStorage.setItem('user_info', JSON.stringify(updatedUser));
    }
  };

  const handlePasswordChange = (currentPassword: string, newPassword: string) => {
    // Update password (in a real app, this would call an API)
    console.log('Password change requested');
  };

  // Translation helper function
  const t = (key: string) => getTranslation(currentLanguage.code, key);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    delete axios.defaults.headers.common['Authorization'];
    
    setIsAuthenticated(false);
    setUser(null);
    setMessages([]);
    setInputText('');
    setSelectedImage(null);
    setShowPrescriptionForm(false);
    setChatSessions([]);
    setCurrentSessionId(null);
    setShowLandingPage(true);
  };

  const handleNavigateToLogin = () => {
    setShowLandingPage(false);
    setShowRegister(false);
  };

  const handleNavigateToRegister = () => {
    setShowLandingPage(false);
    setShowRegister(true);
  };

  const createNewSession = async () => {
    try {
      // Don't create a session immediately - let it be created when first message is sent
      setCurrentSessionId(null);
      setMessages([]);
      
    } catch (error) {
      console.error('Error creating new session:', error);
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      await axios.delete(`/chat/sessions/${sessionId}`);
      
      // If the deleted session was the current one, clear it
      if (sessionId === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      
      // Refresh sessions list
      await fetchChatSessions();
      
      // Close context menu
      setContextMenu(null);
      
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const loadSession = async (sessionId: number, sessionName: string) => {
    try {
      const response = await axios.get(`/chat/sessions/${sessionId}/messages`);
      const sessionMessages = response.data.map((msg: any) => ({
        id: msg.id.toString(),
        text: msg.content,
        isUser: msg.is_user,
        timestamp: new Date(msg.created_at),
        isPrescription: msg.is_prescription
      }));
      
      setMessages(sessionMessages);
      setCurrentSessionId(sessionId);
      setMessages(sessionMessages);
      
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      image: selectedImage ? URL.createObjectURL(selectedImage) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', inputText);
      // Only send language if it's different from user's saved preference
      // The backend will use the user's saved preference as default
      formData.append('language', currentLanguage.code);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      if (currentSessionId) {
        formData.append('session_id', currentSessionId.toString());
      }

      const response = await axios.post('/chat/', formData);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date(),
        isPrescription: response.data.is_prescription_query
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update session info if this is a new session
      if (response.data.session_id && !currentSessionId) {
        setCurrentSessionId(response.data.session_id);
        await fetchChatSessions();
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInputText('');
      setSelectedImage(null);
    }
  };

  const analyzePrescription = async () => {
    if (!selectedImage) return;

    setIsPrescriptionLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      // Only send language if it's different from user's saved preference
      // The backend will use the user's saved preference as default
      formData.append('language', currentLanguage.code);
      if (patientAge) formData.append('patient_age', patientAge);
      if (patientConditions) formData.append('patient_conditions', patientConditions);
      if (currentSessionId) {
        formData.append('session_id', currentSessionId.toString());
      }

      const response = await axios.post('/prescription-analysis/', formData);

      const userMessage: Message = {
        id: Date.now().toString(),
        text: `Prescription Analysis Request${patientAge ? ` (Age: ${patientAge})` : ''}${patientConditions ? ` (Conditions: ${patientConditions})` : ''}`,
        isUser: true,
        timestamp: new Date(),
        image: URL.createObjectURL(selectedImage),
        isPrescription: true
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
        isUser: false,
        timestamp: new Date(),
        isPrescription: true
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setShowPrescriptionForm(false);
      setSelectedImage(null);
      setPatientAge('');
      setPatientConditions('');
      
      // Update session info if this is a new session
      if (response.data.session_id && !currentSessionId) {
        setCurrentSessionId(response.data.session_id);
        await fetchChatSessions();
      }
      
    } catch (error) {
      console.error('Error analyzing prescription:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error analyzing the prescription. Please try again or consult with a pharmacist.',
        isUser: false,
        timestamp: new Date(),
        isPrescription: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsPrescriptionLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Handle clicking outside context menu to close it and ESC key
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [contextMenu]);

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''} ${!isAuthenticated && showLandingPage ? 'landing-mode' : ''}`}>
      {!isAuthenticated ? (
        showLandingPage ? (
          <LandingPage
            onNavigateToLogin={handleNavigateToLogin}
            onNavigateToRegister={handleNavigateToRegister}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLoginPageLanguageChange}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="login-container">
            {showRegister ? (
              <Register 
                onRegister={handleRegister}
                isLoading={isRegisterLoading}
                error={registerError}
                onSwitchToLogin={() => setShowRegister(false)}
                currentLanguage={currentLanguage}
                t={t}
                onLanguageChange={handleLoginPageLanguageChange}
              />
            ) : (
              <Login 
                onLogin={handleLogin}
                isLoading={isLoginLoading}
                error={loginError}
                onSwitchToRegister={() => setShowRegister(true)}
                currentLanguage={currentLanguage}
                t={t}
                onLanguageChange={handleLoginPageLanguageChange}
              />
            )}
          </div>
        )
      ) : (
        <div className="chatgpt-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-header">
              <button 
                onClick={createNewSession}
                className="new-chat-btn"
              >
                <span>+</span> {t('newChat')}
              </button>
            </div>
            
            <div className="conversations-list">
              {chatSessions.map((session) => (
                <div 
                  key={session.id}
                  onClick={() => loadSession(session.id, session.session_name)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                      sessionId: session.id
                    });
                  }}
                  className={`conversation-item ${session.id === currentSessionId ? 'active' : ''}`}
                >
                  <div className="conversation-content">
                    <div className="conversation-title">
                      {session.session_name}
                    </div>
                    <div className="conversation-meta">
                      {session.message_count} {t('messages')}
                    </div>
                  </div>
                  {session.id === currentSessionId && (
                    <div className="active-indicator">●</div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="sidebar-footer">
              <div className="user-info">
                <div className="user-avatar">
                  {user?.full_name?.charAt(0) || 'U'}
                </div>
                <div className="user-details">
                  <div className="user-name">{user?.full_name || 'User'}</div>
                  <div className="user-email">{user?.email}</div>
                </div>
              </div>
              
              <div className="sidebar-actions">
                <button 
                  onClick={() => setShowLanguageSelector(true)}
                  className="sidebar-action-btn"
                >
                  🌍 {currentLanguage.nativeName}
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="sidebar-action-btn"
                >
                  ⚙️ {t('settings')}
                </button>
                <button 
                  onClick={handleLogout}
                  className="sidebar-action-btn logout"
                >
                  {t('logout')}
                </button>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="main-chat">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <h1>{t('pediatricAIAssistant')}</h1>
                <p>{t('askMeAboutHealth')}</p>
              </div>
              
              <div className="chat-header-actions">
                <button 
                  onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                  className={`header-action-btn ${showPrescriptionForm ? 'active' : ''}`}
                >
                  {t('prescriptionAnalysis')}
                </button>
              </div>
            </div>

            {/* Prescription Form */}
            {showPrescriptionForm && (
              <div className="prescription-form">
                <h3>{t('prescriptionAnalysis')}</h3>
                <div className="prescription-inputs">
                  <div className="input-group">
                    <label>{t('patientAge')}</label>
                    <input
                      type="text"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder={t('patientAgePlaceholder')}
                    />
                  </div>
                  <div className="input-group">
                    <label>{t('medicalConditions')}</label>
                    <input
                      type="text"
                      value={patientConditions}
                      onChange={(e) => setPatientConditions(e.target.value)}
                      placeholder={t('medicalConditionsPlaceholder')}
                    />
                  </div>
                </div>
                <div className="prescription-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-btn"
                  >
                    {t('uploadPrescription')}
                  </button>
                  {selectedImage && (
                    <button 
                      onClick={analyzePrescription}
                      disabled={isPrescriptionLoading}
                      className="analyze-btn"
                    >
                      {isPrescriptionLoading ? t('analyzing') : t('analyzePrescription')}
                    </button>
                  )}
                </div>
                {selectedImage && (
                  <div className="selected-image">
                    <img 
                      src={URL.createObjectURL(selectedImage)} 
                      alt="Selected" 
                      className="preview-image"
                    />
                    <button 
                      onClick={removeSelectedImage}
                      className="remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👨‍⚕️</div>
                  <h2>{t('welcome')}</h2>
                  <p>{t('emptyStateMessage')}</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`message ${message.isUser ? 'user' : 'ai'}`}>
                    <div className="message-avatar">
                      {message.isUser ? '👤' : '👨‍⚕️'}
                    </div>
                    <div className="message-content">
                      {message.isUser ? (
                        <div className="user-message">
                          {message.text}
                        </div>
                      ) : (
                        <div className="ai-message">
                          <ReactMarkdown 
                            components={{
                              h1: ({node, children, ...props}) => <h1 style={{fontSize: '1.2em', margin: '8px 0'}} {...props}>{children}</h1>,
                              h2: ({node, children, ...props}) => <h2 style={{fontSize: '1.1em', margin: '8px 0'}} {...props}>{children}</h2>,
                              h3: ({node, children, ...props}) => <h3 style={{fontSize: '1em', margin: '6px 0'}} {...props}>{children}</h3>,
                              p: ({node, ...props}) => <p style={{margin: '4px 0'}} {...props} />,
                              ul: ({node, ...props}) => <ul style={{margin: '8px 0', paddingLeft: '20px'}} {...props} />,
                              ol: ({node, ...props}) => <ol style={{margin: '8px 0', paddingLeft: '20px'}} {...props} />,
                              li: ({node, ...props}) => <li style={{margin: '2px 0'}} {...props} />,
                              strong: ({node, ...props}) => <strong style={{fontWeight: 'bold'}} {...props} />,
                              em: ({node, ...props}) => <em style={{fontStyle: 'italic'}} {...props} />,
                              blockquote: ({node, ...props}) => (
                                <blockquote style={{
                                  borderLeft: '3px solid #667eea',
                                  paddingLeft: '12px',
                                  margin: '8px 0',
                                  fontStyle: 'italic'
                                }} {...props} />
                              ),
                              code: ({node, ...props}) => (
                                <code style={{
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                  padding: '2px 4px',
                                  borderRadius: '3px',
                                  fontFamily: 'monospace'
                                }} {...props} />
                              )
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                      {message.image && (
                        <img 
                          src={message.image} 
                          alt="Uploaded" 
                          className="message-image"
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="message ai">
                  <div className="message-avatar">👨‍⚕️</div>
                  <div className="message-content">
                    <div className="ai-message">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {isPrescriptionLoading && (
                <div className="message ai">
                  <div className="message-avatar">👨‍⚕️</div>
                  <div className="message-content">
                    <div className="ai-message">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chatPlaceholder')}
                  className="text-input"
                  rows={1}
                />
                <div className="input-actions">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-btn"
                    type="button"
                  >
                    📷
                  </button>
                  <button 
                    onClick={sendMessage}
                    disabled={isLoading || (!inputText.trim() && !selectedImage)}
                    className="send-btn"
                  >
                    {t('send')}
                  </button>
                </div>
              </div>
              
              {selectedImage && !showPrescriptionForm && (
                <div className="selected-image">
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Selected" 
                    className="preview-image"
                  />
                  <button onClick={removeSelectedImage} className="remove-image-btn">
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu && (
        <button 
          onClick={() => contextMenu.sessionId && deleteSession(contextMenu.sessionId)}
          className="context-menu-item delete"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
        >
          🗑️ Delete Chat
        </button>
      )}
      
      {/* Language Selector Modal */}
      <LanguageSelector
        onLanguageSelect={handleLanguageSelect}
        isVisible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
      
      {/* Settings Modal */}
              <Settings
          isVisible={showSettings}
          onClose={handleSettingsClose}
          currentLanguage={currentLanguage}
          currentEmail={user?.email || ''}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          darkModePreference={darkModePreference}
          isDarkMode={isDarkMode}
          onDarkModeToggle={handleDarkModeToggle}
        />
    </div>
  );
}

export default App;
