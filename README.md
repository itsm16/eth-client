# Frontend

The frontend is built with React and focuses on a responsive, smooth user experience.

### Key Decisions
- TanStack Query (React Query)
    - Used for data fetching, caching, and syncing server state efficiently.
    - Helps manage async operations like fetching applications and AI responses with built-in loading and error states.
- Zustand
    - Used for lightweight global state management.
    -Specifically used for triggering UI states like loading indicators without overcomplicating the app.
- Component Design
    - Reusable and modular components for:
    - Kanban board columns
    - Application cards
    - Dialogs/forms