# Arovi Frontend

A React TypeScript application for Arovi, an AI-powered pediatric health assistant.

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and connect your repository
3. Set environment variable: `REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com`
4. Deploy automatically!

### Option 2: Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) and connect your repository
3. Set environment variable: `REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com`
4. Build command: `npm run build`
5. Publish directory: `build`

### Option 3: Manual Deployment
```bash
# Install dependencies
npm install

# Build for production
REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com npm run build

# Upload the 'build' folder to your hosting platform
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌐 Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com
```

For local development, use:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
```

## 📁 Project Structure

```
src/
├── App.tsx              # Main application component
├── LandingPage.tsx      # Landing page component
├── Login.tsx           # Login component
├── Register.tsx        # Registration component
├── Settings.tsx        # Settings component
├── LanguageSelector.tsx # Language selection
├── languages.ts        # Internationalization
├── utils/
│   └── darkMode.ts     # Dark mode utilities
└── App.css             # Styles
```

## 🎨 Features

- **Multi-language Support**: English, Hindi, and more
- **Dark/Light Mode**: With system preference detection
- **Authentication**: Login/Register with JWT tokens
- **Chat Interface**: AI-powered pediatric consultation
- **Prescription Analysis**: Upload and analyze medical prescriptions
- **Session Management**: Save and load chat sessions
- **Responsive Design**: Works on all devices

## 🔗 Backend Integration

The frontend connects to the Arovi backend at:
`https://arovi-backend.onrender.com`

## 🛠️ Tech Stack

- **React 19.1.1** with TypeScript
- **Axios** for API calls
- **React Markdown** for content rendering
- **CSS** for styling
- **Create React App** for build tooling

## 📦 Build Output

The build process creates optimized static files in the `build/` directory:
- `index.html` - Main HTML file
- `static/js/` - JavaScript bundles
- `static/css/` - CSS files
- `static/media/` - Images and assets

## 🔒 Security Notes

- JWT tokens are stored in localStorage
- API calls include Authorization headers
- CORS is handled by the backend
- Environment variables are embedded at build time

## 🚨 Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check environment variables are set correctly
- Verify the backend URL is accessible

### Deployment Issues
- Make sure the build directory is uploaded correctly
- Check that environment variables are set in your hosting platform
- Verify CORS settings on your backend

### API Connection Issues
- Test the backend URL: `https://arovi-backend.onrender.com`
- Check network connectivity
- Verify API endpoints are working

## 📞 Support

For issues or questions:
1. Check the backend is running at `https://arovi-backend.onrender.com`
2. Verify environment variables are set correctly
3. Check browser console for error messages
4. Ensure CORS is properly configured on the backend

---

**Arovi Frontend** - Your trusted companion for child healthcare 🩺
