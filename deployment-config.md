# Arovi Frontend Deployment Configuration

## Environment Variables

Create the following environment files in your project root:

### For Production (.env.production)
```
REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com
```

### For Development (.env.development)
```
REACT_APP_API_BASE_URL=http://localhost:8000
```

## Deployment Options

### 1. Vercel (Recommended)
- Connect your GitHub repository to Vercel
- Set environment variable: `REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com`
- Deploy automatically on push to main branch

### 2. Netlify
- Connect your GitHub repository to Netlify
- Set environment variable: `REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com`
- Build command: `npm run build`
- Publish directory: `build`

### 3. GitHub Pages
- Add to package.json scripts:
  ```json
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
  ```
- Install gh-pages: `npm install --save-dev gh-pages`
- Set environment variable in GitHub repository settings

### 4. Render
- Create a new Static Site
- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `build`
- Set environment variable: `REACT_APP_API_BASE_URL=https://arovi-backend.onrender.com`

## Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start development server
npm start
```

## Important Notes

1. The app is now configured to use `https://arovi-backend.onrender.com` as the default API URL
2. Environment variables must be set before building
3. CORS should be configured on your backend to allow requests from your frontend domain
4. Make sure your backend is accessible and responding correctly
