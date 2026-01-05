# Design & UX Audit Report: AgencyOS

> **Auditor**: Lead Product Designer / Senior Frontend Engineer
> **Date**: 2026-01-02
> **Focus**: Consistency, Usability, Modern Aesthetics

---

## Executive Summary
AgencyOS has a solid functional foundation but suffers from "Engineer Design" — functional but cognitively high-load. The current navigation patterns (grids vs tables vs lists) are inconsistent, and data entry flows (Onboarding, Tasks) are disjointed. To achieve a "Premium Agency" feel, we must transition from **Container-Based Design** (everything in boxes) to **Flow-Based Design** (guided experiences).

---

## 1. Client Onboarding Audit

### 🔴 Friction Points
1.  **Non-Linear Cognitive Load**: The current "Tabbed" interface (`ClientIntakePage`) presents all 5 sections (Basic Info, Assets, etc.) equally. A new client/admin doesn't know *where to start*.
2.  **Lack of Feedback**: When a section is saved, there is no "Celebration" or visual transition to the next step. It feels static.
3.  **Visual Overwhelm**: The sidebar + editor + context panel (3 columns) allows for great density but can feel cramped on smaller desktop screens.

### ✨ Improvement Plan: "The Concierge Wizard"
Instead of a checklist, use a **Stepper Wizard** for the *initial* setup. The checklist view becomes the "Review" state later.

#### Suggested Component: `OnboardingWizard.tsx` (Concept)
```tsx
// Using a linear stepper reduces decision fatigue
const STEPS = [
  { id: 'basic', title: 'Who are they?' },
  { id: 'reqs', title: 'What do they need?' },
  { id: 'assets', title: 'Brand Assets' }
]

export function OnboardingWizard() {
  const [step, setStep] = useState(0)
  
  return (
    <div className="max-w-xl mx-auto py-10">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
           <div key={s.id} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>
      
      {/* Step Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
           <h2 className="text-2xl font-bold mb-6">{STEPS[step].title}</h2>
           {/* Section Form Here */}
        </motion.div>
      </AnimatePresence>
      
      {/* Floating Action Bar */}
      <div className="flex justify-between mt-8">
         <Button variant="ghost" onClick={prev}>Back</Button>
         <Button onClick={next}>Next: {STEPS[step + 1]?.title}</Button>
      </div>
    </div>
  )
}
```

---

## 2. Research & Brainstorming Interface

### 🔴 Friction Points
1.  **Generic Cards**: The `ResearchCard` is indistinguishable from a generic blog post card. Research is dense; cards need to show *type* more distinctively (e.g., specific icon colors for "SWOT" vs "Competitor").
2.  **Typography**: Reading long-form research in a sans-serif font (Geist/Inter) is fatiguing.
3.  **Whitespace**: The grid layout is too rigid. Brainstorming requires a more fluid layout.

### ✨ Improvement Plan: "The Studio Layout"
1.  **Masonry Grid**: Use a masonry layout for "Ideas" so notes of different lengths fit naturally (like Google Keep or Pinterest).
2.  **Typography**: Introduce a serif font (e.g., `Playfair Display` or `Merriweather`) for the *Document Content* view to mimic a high-quality report.
3.  **Visual Tags**: Replace text tags `_` with visual badges.

---

## 3. Task Management (Dashboard)

### 🔴 Friction Points
1.  **Component Overload**: The `TaskList` grid view is poor for scanning 20+ tasks. It hides critical info like "Due Date" inside the card footer.
2.  **Binary Status**: The checkbox interaction (`todo` <-> `done`) ignores the reality of agency work (`In Review`, `Blocked`).
3.  **Missing Context**: A task card rarely exists in isolation. It needs to show the *Client* or *Project* it belongs to prominently.

### ✨ Improvement Plan: "Kanban & Grouping"
1.  **Kanban Board**: Introduce columns: `To Do`, `In Progress`, `Client Review`, `Done`.
2.  **Group By**: Add a dropdown to "Group by Client". This transforms the list into sections:
    *   **Acme Corp**
        *   [Task 1]
        *   [Task 2]
    *   **Oceanic**
        *   [Task 3]

---

## 4. Visual Design System

### 🔴 Critical Issues
*   **Inconsistent Status Colors**: Status colors are hardcoded in multiple components (`TaskCard`, `ClientCard`, `ClientTable`).
*   **Lack of "Surface" Hierarchy**: Everything is on `bg-background` or standard `Card`. We need "subtler" surfaces for secondary content.

### 🎨 Recommended Visual Theme: "Obsidian & Paper"
*   **Dark Mode (Obsidian)**: Deep gray backgrounds (`#0a0a0a`), subtle borders (`border-white/10`), and vibrant primary accents (Electric Blue or Neon Purple) for actions.
*   **Light Mode (Paper)**: Warm white backgrounds (`#fdfdfd`), sharp black text, and muted pastel badges.

### 🛠️ Refactoring: Centralize Status Logic
Extract strictly hardcoded logic into a hook or utility component.

```tsx
// src/components/ui/status-badge.tsx
const STATUS_STYLES = {
  onboarding: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-green-100 text-green-700 border-green-200",
  // ...
}

export function StatusBadge({ status }) {
  return (
    <Badge className={cn("uppercase tracking-wider border-0", STATUS_STYLES[status])}>
      {status.replace('_', ' ')}
    </Badge>
  )
}
```

---

## Immediate Next Steps (The "Quick Wins")

1.  **Refactor**: Create `StatusBadge.tsx` and replace hardcoded badges in Clients/Tasks.
2.  **Update Typography**: Add a `prose` class (using `@tailwindcss/typography`) to the Research Editor for better reading experience.
3.  **Implement Kanban**: Add a simple "Board View" toggle to the Tasks page.
