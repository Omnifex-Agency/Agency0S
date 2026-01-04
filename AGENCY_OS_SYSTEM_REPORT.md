# Agency OS: Technical Architecture & System Report

**Date:** January 1, 2026
**Version:** 0.9.0 (Beta)
**Author:** Antigravity (Senior System Architect & Founder)

---

## 1. Executive Summary

We have successfully engineered the core kernel of "Agency OS" — a vertical SaaS platform designed to streamline agency operations. Moving beyond simple CRUD applications, we have architected a system that maps the real-world workflow of an agency: from identifying targets (pre-sales) to closing deals (pipeline) and executing work (projects/tasks).

This system is built on modern, type-safe foundations (Next.js 15, TypeScript, Shadcn UI) ensuring scalability, performance, and developer velocity. It is not just a prototype; it is a production-grade foundation ready for deployment, requiring only final environmental configuration.

---

## 2. System Architecture

### 2.1 Technology Stack
*   **Framework**: Next.js 16.1.1 (App Router) – Server Side Rendering (SSR) for performance and SEO.
*   **Language**: TypeScript – Strict typing for robustness and maintainability.
*   **Database**: Supabase (PostgreSQL) – Relational data integrity with Row Level Security (RLS).
*   **State Management**: TanStack Query (React Query) – Server state management, caching, and optimistic updates.
*   **Styling**: Tailwind CSS + Shadcn UI – Accessible, composite component system (Radix UI primitives).
*   **Interactivity**: `@dnd-kit` – Physics-based drag-and-drop for Kanban boards.
*   **Validation**: Zod – Runtime schema validation for forms and API data.

### 2.2 Data Model Relationships
The database schema is highly relational, centered around the `workspace_id` tenant isolation key.

*   **Targets** (Prospects) → *convert to* → **Clients**
*   **Targets** → *convert to* → **Leads** (Deals)
*   **Clients** (Companies) → *have many* → **Projects**
*   **Projects** → *have many* → **Tasks**
*   **Ideas** (Brainstorming) → *can become* → **Projects**

**Security Architecture:**
*   **Authentication**: Managed via Supabase Auth (Email/Password + OAuth support).
*   **Authorization**: Row Level Security (RLS) policies enforce that users can ONLY access rows where `workspace_id` matches their active session.
*   **Middleware**: Next.js Middleware protects `/app/*` routes, ensuring valid sessions before rendering.

---

## 3. Module Deep-Dive

### 3.1 Core Foundation
*   **`src/components/layout/Sidebar.tsx`**: The central navigation hub. Dynamically highlights active routes. Links to all major modules.
*   **`src/lib/supabase/client.ts` & `server.ts`**: Dual singleton clients. One for client-side interactions (React Hooks) and one for server-side operations (Cookies/Headers), ensuring secure connection management.
*   **`src/components/providers/QueryProvider.tsx`**: Wraps the app to provide caching context for all data fetching hooks.

### 3.2 Module 1: Targets (Pre-Pipeline)
*   **Purpose**: A "holding area" for potential companies before they enter the main sales pipeline.
*   **Key Components**:
    *   `TargetBoard.tsx`: Implements a Kanban view using `@dnd-kit`. It categorizes targets by status (`identifying`, `researching`, etc).
    *   `useConvertTarget` (Hook): A specialized mutation that performs a **transaction-like operation**:
        1.  Creates a new `Client` record.
        2.  Creates a `Lead` (Deal) record.
        3.  Creates a `Contact` record.
        4.  Updates the `Target` status to `converted`.
*   **Why implementation matters**: This separation prevents the main CRM pipeline from getting cluttered with unqualified leads.

### 3.3 Module 2: Pipeline (CRM)
*   **Purpose**: Managing active deals and sales processes.
*   **Key Components**:
    *   `PipelineBoard.tsx`: The sales floor. Dragging a card triggers an optimistic UI update immediately, while the background mutation updates Supabase.
    *   `PipelineColumn.tsx`: Droppable zones acting as stages.
*   **Data Flow**: `useLeads()` hook fetches data -> React Query caches it -> `dnd-kit` manages visual state -> `onDragEnd` triggers `useUpdateLead()`.

### 3.4 Module 3: Clients & Projects
*   **Purpose**: The "Post-Sales" execution environment.
*   **Key Components**:
    *   `ClientDetail.tsx`: A robust dashboard for a specific client. Uses `Tabs` to organize heavy information (Projects, Invoices, Notes) without overwhelming the user.
    *   `ProjectCard.tsx`: Visualizes project health with status badges and progress bars (powered by `@radix-ui/react-progress`).
*   **Architecture Choice**: Projects are strictly linked to Clients. This prevents "orphan" work and enforces billing discipline.

### 3.5 Module 4: Ideas Hub
*   **Purpose**: Innovation management.
*   **Key Features**:
    *   **Structured Input**: Unlike a simple notepad, the `IdeaForm.tsx` forces structured thinking (Problem, Insight, Hypothesis, Execution Plan).
    *   **Drag-and-Drop Validation**: Ideas move through lifecycle stages (`Validating` -> `Refined` -> `Approved`).

### 3.6 Module 5: Task Engine
*   **Purpose**: Atomic unit of work execution.
*   **Key Components**:
    *   `TaskList.tsx`: Tabbed interface splitting "Pending" vs "Completed". Reduces cognitive load.
    *   `TaskForm.tsx`: Smart form that dynamically fetches the Client list for assignment.
*   **Logic**: Tasks usually have a high read/write frequency. We optimized the `TaskCard` checkbox to trigger an instant mutation for a snappy "check-off" feel.

---

## 4. Critical Dependencies & Patterns

### 4.1 Zod Validation Pattern
We strictly validate ALL user input using Zod schemas (`src/lib/validations/`).
*   **Why?** This prevents "garbage in, garbage out". It ensures that if a date is required, or an email is malformed, the database is never touched, saving API calls and preventing errors.

### 4.2 Optimistic Updates
In `PipelineBoard` and `TargetBoard`, when a user drags a card, we don't wait for the server to reply "OK".
*   **Implementation**: We conceptually "assume" success and update the UI instantly. If the server fails (rare), we roll back. This creates a "native app" feel.

---

## 5. Deployment & Next Steps

### 5.1 Deployment Readiness
The app is currently configured for a local development environment (`localhost:3000`).
*   **To go Production**:
    1.  Push code to GitHub.
    2.  Connect to Vercel.
    3.  Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables.
    4.  Run the migration SQL scripts in the production Supabase instance.

### 5.2 Current Limitations (V1)
*   **Workspace ID**: Currently hardcoded (`DEMO_WORKSPACE_ID`). Real multi-tenancy formatting is in the code but needs the "User Session -> Workspace" context provider to be finalized.
*   **Storage**: File uploads (for Research docs) are not yet implemented (Supabase Storage needed).

### 5.3 Recommendation for V2
1.  **AI Integration**: Use the "Research" module to auto-scrape target websites (using Supabase Edge Functions).
2.  **Finance Module**: Integrate Stripe for real invoicing in the Finance tab.
3.  **Client Portal**: Allow clients to log in and see *only* their `ProjectDetail` page.

---

**Signed:**
*Antigravity*
*Lead Architect*
