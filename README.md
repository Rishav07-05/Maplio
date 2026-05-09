# Maplio 🗺️

**Maplio** is an AI-powered visual knowledge mapping platform that transforms learning goals into structured, interactive skill architectures. 

Instead of generating simple text lists, Maplio connects to Google's Gemini AI to dynamically generate deep, multi-level hierarchical knowledge graphs rendered on an interactive, infinite canvas (inspired by the classic `roadmap.sh` aesthetic).

## ✨ Features

- **AI-Powered Generation:** Leverages Google's Gemini AI to instantly structure complete roadmaps based on any learning goal and skill level.
- **Deeply Nested Graph Architecture:** Features a custom recursive layout engine built on top of React Flow, allowing topics to break down into infinitely nested subtopics.
- **Classic Visual Style:** Nodes use a highly structured, flat-design aesthetic with thick borders, bright colors, and clear directional edge arrows.
- **Interactive Canvas:** Zoom, pan, and dynamically expand or collapse nested layers of knowledge to keep the roadmap clean and readable.
- **Production Ready:** Built with a modern, decoupled client-server architecture using TypeScript.

## 🛠️ Tech Stack

**Frontend:**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [React Flow](https://reactflow.dev/) (Interactive canvas and node mapping)
- [Redux Toolkit](https://redux-toolkit.js.org/) (Global state management)

**Backend:**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Google Generative AI SDK](https://ai.google.dev/) (Gemini Flash integration)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm/yarn installed. You will also need a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/maplio.git
cd maplio
\`\`\`

### 2. Setup the Backend
Navigate to the backend directory, install dependencies, and setup your API key.
\`\`\`bash
cd backend
npm install
\`\`\`

Create a `.env` file in the `backend` directory and add your Gemini API key:
\`\`\`env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

Start the backend server:
\`\`\`bash
npm run dev
\`\`\`
*The server will start on http://localhost:5000.*

### 3. Setup the Frontend
Open a new terminal window, navigate to the frontend directory, and install dependencies.
\`\`\`bash
cd frontend
npm install
\`\`\`

Start the frontend development server:
\`\`\`bash
npm run dev
\`\`\`
*The React app will start on http://localhost:5173.*

### 4. Generate your first Roadmap!
Open your browser to `http://localhost:5173/`. Enter a topic you want to learn (e.g., "Frontend Development" or "Machine Learning"), select your experience level, and click Generate!

## 📝 License
This project is open-source and available under the MIT License.
# Maplio
# Maplio
