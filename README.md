# Lyzr Notes Application

A full-stack notes application with AI-powered summarization capabilities, built with Next.js frontend and FastAPI backend.

## 🚀 Features

### Core Features

- **Create Notes**: Add new notes with timestamp-based IDs
- **View Notes**: List all stored notes
- **Delete Notes**: Remove notes by ID
- **AI Summarization**: Summarize notes using OpenAI GPT-4o-mini or Google Gemini-2.5-flash
- **Real-time UI**: Interactive carousel-based note browsing with charts visualization

### AI Models Supported

- **OpenAI**: GPT-4o-mini model for note summarization
- **Google Gemini**: Gemini-2.5-flash model for note summarization

### UI Components

- Responsive carousel for note navigation
- Interactive charts for data visualization
- Modern UI with Tailwind CSS styling
- Accessible components with proper ARIA labels

## 🌐 Live Demo

- **Frontend**: https://notes.mrvineetraj.live
- **Backend API**: https://notesapp-mrvineetraj.onrender.com/

## 📡 API Endpoints

### Base URLs

- **Frontend**: `https://notes.mrvineetraj.live`
- **Backend API**: `https://notesapp-mrvineetraj.onrender.com/`
- **Local Development**:
  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:8000`

### Endpoints

#### 1. Health Check

```
GET /
```

**Response:**

```
server is up
```

#### 2. List All Notes

```
GET /api/notes
```

**Response:**

```json
[
  {
    "id": "1701234567890",
    "text": "This is a sample note"
  },
  {
    "id": "1701234567891",
    "text": "Another note with some content"
  }
]
```

#### 3. Create Note

```
POST /api/notes
```

**Request Body:**

```json
{
  "text": "Your note content here"
}
```

**Response:** (Status: 201 Created)

```json
{
  "id": "1701234567892",
  "text": "Your note content here"
}
```

#### 4. Delete Note

```
DELETE /api/notes/{note_id}
```

**Response:** (Status: 204 No Content)

```
(Empty response body)
```

**Error Response:** (Status: 404 Not Found)

```json
{
  "detail": "Note not found"
}
```

#### 5. Summarize Note with AI

```
POST /api/notes/summary
```

**Request Body:**

```json
{
  "userQuery": "Summarize the main points",
  "notesId": "1701234567890",
  "modelName": "openai"
}
```

**Response:**

```json
{
  "summary": "AI-generated summary of the note based on your query"
}
```

**Supported Models:**

- `"openai"` - Uses GPT-4o-mini
- `"gemini"` - Uses Gemini-2.5-flash

**Error Responses:**

- **400 Bad Request**: Missing required fields or invalid model name

```json
{
  "error": "userQuery and notesId are required"
}
```

- **404 Not Found**: Note not found

```json
{
  "error": "Note not found"
}
```

- **500 Internal Server Error**: Summarization failed

```json
{
  "error": "Failed to summarize note"
}
```

## 🛠️ Technology Stack

### Frontend (Next.js)

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**:
  - Custom carousel component with Embla Carousel
  - Chart components using Recharts
  - Accessible UI components with proper TypeScript definitions
- **Icons**: Lucide React
- **Deployment**: Custom domain on `notes.mrvineetraj.live`

### Backend (FastAPI)

- **Framework**: FastAPI with Python
- **AI Integration**:
  - OpenAI API (GPT-4o-mini)
  - Google Generative AI (Gemini-2.5-flash)
- **HTTP Client**: httpx for external requests
- **Environment**: python-dotenv for configuration
- **Deployment**: Render.com

### Infrastructure

- **Frontend Hosting**: Custom domain deployment
- **Backend Hosting**: Render.com
- **Keep-Alive**: Automated ping system to prevent cold starts (5-minute intervals)
- **Proxy**: Next.js API routes proxy to FastAPI backend

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- OpenAI API Key (optional)
- Google Gemini API Key (optional)

### Environment Variables

Create `.env` files in both directories:

**Frontend (`next-app/.env`):**

```env
BACKEND_URL="https://notesapp-mrvineetraj.onrender.com/"
```

**Backend (`server/.env`):**

```env
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd lyzr
```

2. **Backend Setup**

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

3. **Frontend Setup**

```bash
cd next-app
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

## 📝 Usage Examples

### Creating a Note (Frontend)

```javascript
// Using the live frontend at notes.mrvineetraj.live
const response = await fetch("/api/notes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "My new note" }),
});
const newNote = await response.json();
```

### Direct API Call (Backend)

```javascript
// Direct call to backend API
const response = await fetch(
  "https://notesapp-mrvineetraj.onrender.com/api/notes",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: "My new note" }),
  }
);
const newNote = await response.json();
```

### Summarizing with AI

```javascript
const response = await fetch("/api/notes/summary", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userQuery: "What are the key points?",
    notesId: "1701234567890",
    modelName: "openai",
  }),
});
const result = await response.json();
console.log(result.summary);
```

## 🏗️ Project Structure

```
lyzr/
├── next-app/          # Frontend Next.js application
│   ├── components/    # UI components (carousel, charts, etc.)
│   ├── app/          # Next.js app directory
│   ├── .gitignore    # Git ignore rules
│   └── .env          # Frontend environment variables
└── server/           # Backend FastAPI application
    ├── main.py       # FastAPI routes and application
    ├── models.py     # Pydantic data models
    ├── storage.py    # In-memory data storage
    ├── llm_clients.py # AI model integrations
    └── .env          # Backend environment variables
```

## 🔄 Deployment

### Live Deployments

- **Frontend**: Deployed on custom domain `notes.mrvineetraj.live`
- **Backend**: Deployed on Render.com at `notapp-mrvineetraj.onrender.com`

### Features

- Automatic keep-alive functionality
- Environment-based configuration
- Production-ready error handling
- CORS configuration for cross-origin requests
- Custom domain setup with proper routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
