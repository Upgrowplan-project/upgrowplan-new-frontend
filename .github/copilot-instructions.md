# AI Agent Instructions for UpgrowPlan

This codebase implements a business plan generation system with two main components:
- Frontend: Next.js application with chat interface (`upgrowplan/`)
- Backend: FastAPI server handling survey logic and data collection (`onboarding/`)

## Core Components

### Backend (Python)
- `session.py`: Core survey session management
  - Handles WebSocket communication
  - Manages question flow and branching logic
  - Processes user responses and file uploads
  
- `assistant.py`: AI assistant integration
  - Generates contextual questions
  - Interprets user responses
  - Extracts data from long-form text

### Frontend (Next.js/TypeScript)
- `app/solutions/plan/page.tsx`: Main chat interface
- `components/`: Reusable UI components
- Uses WebSocket for real-time communication with backend

## Key Workflows

### Survey Flow
1. Session starts with welcome message
2. Questions follow structured blocks:
   - onboarding → businessIdea → operations → financials → attachments → completion
3. Responses update context and influence subsequent questions
4. Files can be uploaded and stored in session-specific directories

### Development Workflow
1. Frontend development:
   ```bash
   cd upgrowplan
   npm run dev
   ```
2. Backend development:
   ```bash
   cd onboarding
   uvicorn main:app --reload
   ```

## Project Conventions

### Backend
- Use async/await for WebSocket communication
- Follow strict typing with TypeScript-style type hints
- Handle all WebSocket messages in try/catch blocks
- Update context before proceeding to next question

### Frontend
- Use TypeScript for all new components
- Follow Next.js 13+ conventions with `use client` directive
- Manage WebSocket state in page components
- Use Bootstrap/react-bootstrap for styling

## Integration Points
- WebSocket: Main communication channel between frontend and backend
- File uploads: Base64 encoded through WebSocket
- Questions schema: Defined in `data/live_brief4.json`

## Common Patterns
- Survey branching: Check `_should_ask_question()` and `_handle_branches()`
- Context updates: Use `_update_context()` to maintain session state
- Progress tracking: Monitor `all_questions_asked` set
- Error handling: Send structured error messages through WebSocket