# Maplio

Maplio is a full-stack web application that generates interactive, visual roadmaps for learning objectives. It uses Google's Gemini AI to generate hierarchical learning paths and renders them using a custom recursive layout engine built on React Flow.

## Architecture & Features

The application consists of a decoupled architecture:
- **Node.js/Express Backend:** Interfaces with the Gemini AI model to generate structured JSON data representing topics and deeply nested subtopics based on user input.
- **React/TypeScript Frontend:** Parses the JSON payload and maps it to a responsive, interactive infinite canvas.

**Key Technical Features:**
- **Recursive Graph Layout:** A custom deterministic layout algorithm places the main topics in a central vertical spine while branching subtopics horizontally. Supports infinite nesting depths.
- **Dynamic Node Rendering:** Custom React Flow nodes handle variable data states, including expandable/collapsible children and automatic edge routing.
- **Structured AI Output:** Uses strict JSON schema enforcement to ensure the LLM consistently returns the required graph data structure.

## Tech Stack

**Frontend:**
- React 18 & Vite
- TypeScript
- Tailwind CSS
- React Flow
- Redux Toolkit

**Backend:**
- Node.js & Express
- Google Generative AI SDK (Gemini Flash)

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- A Gemini API key from Google AI Studio

### Backend Configuration
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with your API key:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Configuration
1. Open a new terminal and navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:5173`.
