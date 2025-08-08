# 🩺 Arovi - Pediatric AI Assistant

A comprehensive AI-powered pediatrician assistant that provides health guidance, medication analysis, and prescription review for parents and caregivers. Built with modern web technologies and designed with a ChatGPT-like interface.

🌐 **Live Demo**: [https://arovi-one.vercel.app/](https://arovi-one.vercel.app/)

## 🚀 Features

### 🤖 AI-Powered Health Assistant
- **Symptom Analysis**: Upload images of rashes, injuries, or health concerns
- **Medication Safety**: Analyze prescriptions and medication information
- **Health Guidance**: Get advice on common childhood health issues
- **Professional Tone**: Warm, empathetic responses with medical accuracy

### 🔐 User Management
- **Secure Authentication**: JWT-based login system
- **Session Management**: Persistent chat history across sessions
- **User Profiles**: Personalized experience for each user

### 📱 Modern Interface
- **ChatGPT-like Design**: Familiar and intuitive chat interface
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Real-time Chat**: Instant messaging with AI responses
- **Image Upload**: Drag-and-drop image support
- **Multi-language Support**: Available in 11 languages

### 🏥 Medical Features
- **Prescription Analysis**: Upload prescription images for detailed analysis
- **Medication Safety**: Check dosages, interactions, and age appropriateness
- **Health Disclaimers**: Clear medical disclaimers and safety warnings
- **Emergency Guidance**: Proper escalation for serious concerns

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework for high-performance APIs
- **SQLAlchemy**: Database ORM for data management
- **SQLite**: Lightweight database for development and deployment
- **Google Gemini AI**: Advanced AI model for health analysis and responses
- **JWT**: Secure authentication with JSON Web Tokens
- **Pillow**: Image processing for prescription and symptom analysis
- **Uvicorn**: ASGI server for running the FastAPI application
- **Alembic**: Database migration management

### Frontend
- **React 18**: Modern JavaScript framework for building user interfaces
- **TypeScript**: Type-safe development for better code quality
- **Axios**: HTTP client for API communication
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **React Router**: Client-side routing for single-page application
- **React Markdown**: Rich text rendering for AI responses

### Development & Deployment
- **Node.js**: JavaScript runtime for frontend development
- **npm**: Package manager for frontend dependencies
- **Vercel**: Frontend deployment platform
- **Git**: Version control system

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp env_example.txt .env
   # Edit .env with your configuration
   ```

5. **Run the backend**:
   ```bash
   python start.py
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   Open http://localhost:3000 in your browser

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=sqlite:///./database.db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Gemini API
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### Database Setup

The application uses SQLite by default for development and deployment. The database file is automatically created when you first run the application.

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Chat Management
- `GET /chat/sessions` - Get user's chat sessions
- `POST /chat/sessions` - Create new chat session
- `GET /chat/sessions/{session_id}/messages` - Get session messages
- `POST /chat/` - Send message to AI

### Prescription Analysis
- `POST /prescription-analysis/` - Analyze prescription images

### Health Check
- `GET /health` - API health status

## 💻 Usage

### Getting Started

1. **Register/Login**: Create an account or sign in
2. **Start Chat**: Begin a new conversation or load existing session
3. **Ask Questions**: Type health-related questions
4. **Upload Images**: Share photos of symptoms or prescriptions
5. **Get Analysis**: Receive AI-powered health guidance

### Example Queries

- "My 3-year-old has a fever of 101°F, what should I do?"
- "Is this rash normal for a 6-month-old?"
- "Can you analyze this prescription for my child?"
- "What are the side effects of this medication?"

### Safety Features

- **Medical Disclaimers**: Clear warnings about AI limitations
- **Emergency Guidance**: Proper escalation for serious symptoms
- **Professional Recommendations**: Always suggest consulting healthcare providers
- **Age-Appropriate Advice**: Tailored guidance based on child's age

## 🏗️ Development

### Project Structure

```
IBM/
├── backend/
│   ├── start.py             # FastAPI application entry point
│   ├── database.py          # Database configuration
│   ├── auth.py              # Authentication utilities
│   ├── alembic/             # Database migrations
│   ├── requirements.txt     # Python dependencies
│   └── database.db         # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── Login.tsx       # Login component
│   │   ├── Register.tsx    # Registration component
│   │   ├── LandingPage.tsx # Landing page component
│   │   ├── languages.ts    # Multi-language translations
│   │   └── App.css         # Styles with ChatGPT-like design
│   ├── package.json        # Node.js dependencies
│   └── public/             # Static assets
└── README.md               # This file
```

### Key Features Implemented

- **ChatGPT-like Interface**: Modern chat layout with sidebar and main chat area
- **Multi-language Support**: 11 languages including English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, and Punjabi
- **Dark/Light Theme**: Toggle between themes with consistent styling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Image Upload**: Support for prescription and symptom image analysis
- **Session Management**: Persistent chat history and user sessions

### Adding Features

1. **Backend**: Add new endpoints in `start.py`
2. **Database**: Update models and run migrations with Alembic
3. **Frontend**: Create new components in `src/`
4. **Styling**: Update `App.css` for new UI elements
5. **Translations**: Add new keys to `languages.ts`

## 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel and accessible at [https://arovi-one.vercel.app/](https://arovi-one.vercel.app/)

### Backend Deployment

For production deployment:

1. **Environment**: Use PostgreSQL for production database
2. **Security**: Change default SECRET_KEY
3. **CORS**: Update allowed origins for your domain
4. **SSL**: Enable HTTPS for secure communication
5. **Monitoring**: Add logging and health checks

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "start.py"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

**Medical Disclaimer**: This AI assistant is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for medical decisions. The AI provides general guidance but cannot diagnose, treat, or prescribe medications.

## 🆘 Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🌟 Acknowledgments

- Built with modern web technologies for optimal performance
- Designed with accessibility and user experience in mind
- Powered by Google Gemini AI for intelligent health guidance
- Deployed on Vercel for reliable global access

---

**Built with ❤️ for better pediatric healthcare**

*Visit [Arovi](https://arovi-one.vercel.app/) to experience the future of pediatric health assistance.* 