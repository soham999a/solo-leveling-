# 🚀 LevelUp Life - Ultimate Productivity Platform

A gamified productivity platform inspired by Solo Leveling, featuring 3D environments, AI coaching, and immersive user experiences.

## ✨ Features

### 🎮 Gamification
- **Level System**: Progress through levels by completing habits and tasks
- **XP & Achievements**: Earn experience points and unlock achievements
- **3D Avatar**: Interactive 3D character that evolves with your progress
- **Epic Animations**: Cinematic level-up animations and particle effects

### 🤖 AI-Powered Features
- **Ultimate AI Coach**: Personalized guidance and motivation
- **Smart Habit Generator**: AI-suggested habits based on your goals
- **Daily Reflections**: AI-powered insights and reflection prompts
- **Weekly Boss Challenges**: Epic storylines and challenges

### 📊 Productivity Tools
- **Habit Tracking**: Beautiful, gamified habit management
- **Analytics Dashboard**: Detailed progress tracking and insights
- **Knowledge Hub**: Solo Leveling episode integration for learning
- **Social Features**: Connect with other users and share progress

### 🎨 User Experience
- **3D Environments**: Immersive React Three Fiber scenes
- **Responsive Design**: Works perfectly on all devices
- **Dark Theme**: Sleek, modern interface inspired by Solo Leveling
- **Sound Effects**: Optional audio feedback for enhanced experience

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **3D Graphics**: React Three Fiber + Three.js
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini AI
- **State Management**: Zustand
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Google Gemini AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd levelup-life
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your API keys in `.env`:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Build & Deploy

### Local Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google, Email/Password)
3. Create Firestore database
4. Add your domain to authorized domains

### Gemini AI Setup
1. Get API key from Google AI Studio
2. Add to environment variables
3. The app works with graceful fallbacks if API is unavailable

## 📁 Project Structure

```
levelup-life/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── scenes/             # 3D scenes and environments
│   ├── services/           # API services and utilities
│   ├── store/              # State management (Zustand)
│   ├── utils/              # Helper functions
│   └── styles/             # Global styles and themes
├── public/                 # Static assets
├── docs/                   # Documentation
└── deployment/             # Deployment configurations
```

## 🎯 Key Components

- **Dashboard**: Main productivity hub with habits and progress
- **3D Avatar Scene**: Interactive character with animations
- **AI Coach**: Intelligent guidance and motivation system
- **Knowledge Hub**: Solo Leveling integration for learning
- **Analytics**: Detailed progress tracking and insights

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Environment Variables**: API keys properly secured
- **Error Boundaries**: Graceful error handling
- **Input Validation**: Protected against common vulnerabilities

## 🎨 Customization

The app is highly customizable:
- **Themes**: Easy to modify color schemes
- **3D Models**: Replaceable avatar and environment assets
- **AI Prompts**: Customizable coaching messages
- **Gamification**: Adjustable XP and level systems

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solo Leveling**: Inspiration for the gamification theme
- **React Three Fiber**: Amazing 3D capabilities
- **Firebase**: Robust backend infrastructure
- **Vercel**: Seamless deployment platform

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review the documentation in the `/docs` folder

---

**Built with ❤️ for productivity enthusiasts and Solo Leveling fans**
