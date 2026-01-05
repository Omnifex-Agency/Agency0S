

# Client Intake Tracker + Onboarding Checklist (MVP) — Final Spec (v1)

## What needed changes (quick list)

1. **Add `onboarding_sessions`** (even if you only ever use 1 per client in MVP). This prevents future pain when you need “re-onboarding”, renewals, or multiple projects.
2. **Section keys list mismatch**: You mention A–E but left out one key in schema. Make a fixed enum + seed rows per session.
3. **Split files** from JSON: keep `data` lightweight and store uploads/links in a `files` table (or Supabase storage references). This makes search, cleanup, and permissions easier.
4. **Audit log** needs a real table + consistent trigger policy (or server-side logging).
5. **RLS**: you said workspace checks but your schema didn’t include `workspace_id` everywhere. Add it or enforce via joins.
6. **Section status naming**: you mixed “Submitted/Done”. Keep `section_status` consistent (`draft|waiting|done|changes_requested`) and compute `onboarding_status` from sections.
7. **API routes**: add list pagination, create client, create session+seed sections, comments CRUD.

Everything below includes these fixes.

---

## 1. Overview & Goals

### Objective

Replace manual client tracking with a structured internal tool that centralizes client state and onboarding completion. It must be designed so it can become a client-fillable portal later with minimal rework.

### Product Goals

1. Single source of truth for client stage + onboarding completion.
2. Standardized intake checklist across all clients.
3. Fast follow-ups: copy/paste template + mark done.
4. Audit trail on sensitive areas (Access, Billing).

### User Stories

* Filter and see all clients in `onboarding` stage with `incomplete` onboarding.
* Open client detail and immediately see which onboarding sections are blocked.
* Request changes on a section and leave comment feedback.
* Copy follow-up template and set `last_followup_at` with one click.

---

## 2. IA / Navigation

Routes (Next.js App Router):

* `/app/clients`

  * Client tracker table (filters + search + pagination)
  * Actions: New Client, Export CSV
* `/app/clients/[id]`

  * Header: stage badge + onboarding badge + owner + quick actions
  * Default tab: Intake

    * Left: checklist (A–E)
    * Right: metadata + follow-up + notes + activity
  * (Optional future) Projects / Invoices tabs

---

## 3. UI Wireframes (ASCII)

### A) Client List / Tracker

```text
+------------------------------------------------------------------------------------------------+
| Clients                                                                 [New Client] [Export]  |
|------------------------------------------------------------------------------------------------|
| [ Search name/email... ]  [Stage v] [Onboarding v] [Priority v] [Owner v]        [Clear]       |
|------------------------------------------------------------------------------------------------|
| Name         | Stage        | Onboarding     | Priority | Owner    | Last Follow-up | Updated  |
|--------------|--------------|----------------|----------|----------|----------------|----------|
| Client A     | Onboarding   | Incomplete 40% | High     | Admin    | 2 days ago     | 2h ago   |
| Client B     | Lead         | Not Started    | Low      | Member   | -              | 1d ago   |
| Client C     | In Progress  | Approved       | Medium   | Admin    | 6 days ago     | 3d ago   |
|------------------------------------------------------------------------------------------------|
| < Prev  Page 1 of 5  Next >                                                                    |
+------------------------------------------------------------------------------------------------+
```

### B) Client Detail (Intake)

```text
+------------------------------------------------------------------------------------------------+
| < Back | Client A                            [Stage: Onboarding] [Onboarding: Incomplete 40%] |
|------------------------------------------------------------------------------------------------|
| ONBOARDING CHECKLIST (Session)                 | CLIENT PANEL                                   |
|-----------------------------------------------|-----------------------------------------------|
| Progress: [####------] 40%                     | Owner: Admin                                  |
| Overall: Incomplete                            | Contact: contact@example.com                  |
|                                                | Start: 2026-01-02  Target: 2026-01-15         |
| [v] A. Basic Info            [Done]            |                                               |
| [>] B. Requirements          [Waiting]         | FOLLOW-UP                                     |
| [ ] C. Assets                [Draft]           | Last: 2 days ago                              |
| [ ] D. Access                [Changes Req]     | [Copy Template]  [Mark Done]                  |
| [ ] E. Billing               [Done]            |                                               |
|                                                | NOTES                                         |
| Selected: C. Assets                              +-----------------------------------------+   |
|-----------------------------------------------| | internal notes text...                    |  |
| Fields:                                        | +-----------------------------------------+   |
|  - Logo: [file/link]                           | [Save Notes]                                 |
|  - Brand Kit: [file/link]                      |                                               |
|  - Other Assets: [file/link]                   | COMMENTS (Selected Section)                   |
|                                                | Admin: "Need vector logo"                     |
| [Edit Section] [Mark Done] [Request Changes]   | [Write comment...] [Send]                     |
|                                                |                                               |
|                                                | ACTIVITY                                      |
|                                                | • Member updated Assets (2h ago)              |
|                                                | • Admin requested changes (1d ago)            |
+------------------------------------------------------------------------------------------------+
```

### C) Section Editor (Drawer)

```text
+--------------------------------------------------------------+
| Edit: C. Assets                                        [X]   |
+--------------------------------------------------------------+
| Logo (file OR link)                                           |
|  [ Paste link..._______________________ ] [Upload] [Clear]     |
| Brand Kit (file OR link)                                      |
|  [ Paste link..._______________________ ] [Upload] [Clear]     |
| Other Assets (file OR link)                                   |
|  [ Paste link..._______________________ ] [Upload] [Clear]     |
|--------------------------------------------------------------|
| Status                                                        |
|  ( ) Draft   ( ) Waiting   ( ) Done   ( ) Changes Requested    |
|--------------------------------------------------------------|
| Comments                                                      |
|  - Admin: "Upload vector format"                              |
|  [Write comment...]                                           |
|--------------------------------------------------------------|
|                [Cancel]  [Save Draft]  [Save + Close]         |
+--------------------------------------------------------------+
```

---

## 4. Data Model (Schema)

### Enums

* `client_stage`: `lead`, `confirmed`, `onboarding`, `in_progress`, `delivered`, `closed`
* `priority_level`: `low`, `medium`, `high`
* `onboarding_status`: `not_started`, `incomplete`, `submitted`, `approved` *(computed/maintained)*
* `section_status`: `draft`, `waiting`, `done`, `changes_requested`
* `section_key`: `basic_info`, `requirements`, `assets`, `access`, `billing`

### Tables

#### `clients`

| column            | type              | notes                    |
| ----------------- | ----------------- | ------------------------ |
| id                | uuid pk           |                          |
| workspace_id      | uuid              | required for RLS scoping |
| name              | text              |                          |
| contact_email     | text              | nullable                 |
| contact_phone     | text              | nullable                 |
| stage             | client_stage      |                          |
| onboarding_status | onboarding_status | optional cache column    |
| owner_id          | uuid              | auth.users               |
| priority          | priority_level    |                          |
| start_date        | date              | nullable                 |
| target_date       | date              | nullable                 |
| last_followup_at  | timestamptz       | nullable                 |
| intake_notes      | text              | internal only            |
| created_at        | timestamptz       |                          |
| updated_at        | timestamptz       |                          |

Indexes:

* `(workspace_id, stage)`
* `(workspace_id, owner_id)`
* `(workspace_id, onboarding_status)`
* `lower(name)` for search

#### `onboarding_sessions`

(Foundation for future: multiple intakes per client)

| column                | type              | notes                                     |
| --------------------- | ----------------- | ----------------------------------------- |
| id                    | uuid pk           |                                           |
| workspace_id          | uuid              |                                           |
| client_id             | uuid fk           |                                           |
| template_key          | text              | e.g. `default_v1`                         |
| status                | onboarding_status | not_started/incomplete/submitted/approved |
| completion_percentage | int               | cached (0–100)                            |
| created_at            | timestamptz       |                                           |
| updated_at            | timestamptz       |                                           |
| submitted_at          | timestamptz       | nullable                                  |
| approved_at           | timestamptz       | nullable                                  |

Index: `(client_id)`, `(workspace_id, status)`

#### `onboarding_sections`

| column       | type           | notes                           |
| ------------ | -------------- | ------------------------------- |
| id           | uuid pk        |                                 |
| workspace_id | uuid           |                                 |
| session_id   | uuid fk        |                                 |
| section_key  | section_key    |                                 |
| status       | section_status |                                 |
| data         | jsonb          | structured answers (no secrets) |
| assigned_to  | uuid           | nullable                        |
| updated_at   | timestamptz    |                                 |
| created_at   | timestamptz    |                                 |

Unique constraint:

* `(session_id, section_key)` unique

Index:

* `(session_id)`

#### `files`

Store uploaded assets and links consistently.

| column       | type        | notes                        |
| ------------ | ----------- | ---------------------------- |
| id           | uuid pk     |                              |
| workspace_id | uuid        |                              |
| client_id    | uuid fk     |                              |
| session_id   | uuid fk     |                              |
| section_id   | uuid fk     | nullable                     |
| file_key     | text        | e.g. `logo`, `brand_kit`     |
| kind         | text        | `upload` or `link`           |
| url          | text        | storage URL or external link |
| filename     | text        | nullable                     |
| mime_type    | text        | nullable                     |
| size_bytes   | bigint      | nullable                     |
| created_at   | timestamptz |                              |

Index:

* `(session_id, section_id)`
* `(client_id)`

#### `section_comments`

| column       | type        | notes |
| ------------ | ----------- | ----- |
| id           | uuid pk     |       |
| workspace_id | uuid        |       |
| section_id   | uuid fk     |       |
| user_id      | uuid fk     |       |
| content      | text        |       |
| created_at   | timestamptz |       |

Index: `(section_id, created_at)`

#### `audit_logs`

| column       | type        | notes                                   |
| ------------ | ----------- | --------------------------------------- |
| id           | uuid pk     |                                         |
| workspace_id | uuid        |                                         |
| actor_id     | uuid        |                                         |
| action       | text        | `create_client`, `update_section`, etc. |
| entity_type  | text        | `client`, `section`, `file`, `comment`  |
| entity_id    | uuid        |                                         |
| before       | jsonb       | nullable                                |
| after        | jsonb       | nullable                                |
| created_at   | timestamptz |                                         |

Index: `(workspace_id, created_at)`

---

## 5. API Routes (REST) + Examples

### Conventions

* Auth: Supabase session required.
* All routes enforce `workspace_id` ownership server-side.
* Errors:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid stage", "details": {...} } }
```

---

### 5.1 Clients

#### GET `/api/clients`

Query params:

* `q` (search)
* `stage`, `onboarding_status`, `priority`, `owner_id`
* `page`, `page_size`

Response:

```json
{
  "page": 1,
  "page_size": 20,
  "total": 73,
  "items": [
    {
      "id": "uuid",
      "name": "Client A",
      "stage": "onboarding",
      "onboarding_status": "incomplete",
      "completion_percentage": 40,
      "priority": "high",
      "owner_id": "uuid",
      "last_followup_at": "2026-01-01T10:00:00Z",
      "updated_at": "2026-01-02T08:00:00Z"
    }
  ]
}
```

#### POST `/api/clients`

Creates client + creates default onboarding session + seeds sections A–E.

Request:

```json
{
  "name": "Client A",
  "contact_email": "contact@example.com",
  "contact_phone": "",
  "owner_id": "uuid",
  "priority": "high",
  "stage": "confirmed",
  "start_date": "2026-01-02",
  "target_date": "2026-01-15"
}
```

Response:

```json
{
  "client": { "id": "uuid", "name": "Client A" },
  "session": { "id": "uuid", "status": "not_started" },
  "sections_seeded": ["basic_info","requirements","assets","access","billing"]
}
```

#### PATCH `/api/clients/:id`

Update core metadata and follow-up.

Request:

```json
{
  "last_followup_at": "2026-01-02T10:00:00Z",
  "intake_notes": "Client requested delay.",
  "stage": "onboarding"
}
```

Response:

```json
{
  "id": "uuid",
  "stage": "onboarding",
  "last_followup_at": "2026-01-02T10:00:00Z",
  "updated_at": "2026-01-02T10:00:02Z"
}
```

---

### 5.2 Onboarding (session + sections)

#### GET `/api/clients/:id/onboarding`

Returns session + sections + progress.

Response:

```json
{
  "session": {
    "id": "uuid",
    "status": "incomplete",
    "completion_percentage": 40
  },
  "sections": [
    {
      "section_key": "basic_info",
      "status": "done",
      "data": { "contact_name": "Client Contact", "timezone": "Asia/Kolkata" },
      "comments_count": 0
    },
    {
      "section_key": "assets",
      "status": "changes_requested",
      "data": {},
      "comments_count": 2,
      "files": [
        { "file_key": "logo", "kind": "link", "url": "https://..." }
      ]
    }
  ]
}
```

#### PUT `/api/clients/:id/onboarding/:section_key`

Updates a section (data + status). Also writes audit log and recalculates session progress.

Request:

```json
{
  "status": "done",
  "data": {
    "deliverables": ["Landing Page", "Admin Panel"],
    "deadline": "2026-01-15",
    "reference_links": ["https://example.com/ref"]
  }
}
```

Response:

```json
{
  "section_key": "requirements",
  "status": "done",
  "data": {
    "deliverables": ["Landing Page", "Admin Panel"],
    "deadline": "2026-01-15",
    "reference_links": ["https://example.com/ref"]
  },
  "session": { "status": "incomplete", "completion_percentage": 60 }
}
```

#### POST `/api/clients/:id/onboarding/:section_key/files`

Adds a file record (upload or link). (Upload itself can go to Supabase Storage directly; this stores metadata.)

Request:

```json
{
  "file_key": "logo",
  "kind": "link",
  "url": "https://drive.example/logo.png",
  "filename": "logo.png"
}
```

Response:

```json
{ "id": "uuid", "file_key": "logo", "kind": "link", "url": "https://..." }
```

---

### 5.3 Comments

#### GET `/api/sections/:section_id/comments`

```json
{ "items": [{ "id": "uuid", "content": "Please upload vector format", "created_at": "..." }] }
```

#### POST `/api/sections/:section_id/comments`

Request:

```json
{ "content": "Please upload vector format." }
```

Response:

```json
{ "id": "uuid", "content": "Please upload vector format.", "created_at": "..." }
```

---

### 5.4 Activity / Audit

#### GET `/api/clients/:id/activity`

Response:

```json
{
  "items": [
    { "action": "update_section", "entity_type": "section", "created_at": "..." }
  ]
}
```

---

## 6. Status Machines / Transitions

### Client Stage transitions

* `lead` → `confirmed` → `onboarding` → `in_progress` → `delivered` → `closed`
  Rules:
* Moving to `in_progress` requires onboarding session status = `approved` (or at least 80% + manual override).

### Onboarding session status (computed)

* `not_started`: all sections empty/draft
* `incomplete`: some done, some not
* `submitted`: all sections done (or “submit” in future portal)
* `approved`: admin approves entire session (MVP: manual “Approve” button optional)

### Section status

* `draft` → `waiting` → `done`
* `done` → `changes_requested` → `done`

---

## 7. Security & Compliance Notes

### RLS / Workspace isolation

* Every table has `workspace_id`.
* Policies enforce:

  * user belongs to workspace
  * user can only read/write rows within workspace

### Access section handling (critical)

* Do **not** store secrets/passwords in `data`.
* Add UI warning near Access fields:

  * “Do not paste passwords here. Use secure vault and reference it.”
* Optional: basic validation to reject “password-like” patterns (client-side warning + server-side block).

### Audit logging

* Any write to clients, sections, files, comments => insert audit log row.
* For sensitive sections (`access`, `billing`) always include before/after snapshots (redact if needed).

---

## 8. Phased Implementation Plan

### Phase 1: Internal MVP (now)

* Client list with filters + search + pagination
* Client detail intake view
* Section editor
* Files as link or upload metadata
* Notes + follow-up actions
* Basic activity feed (audit logs)

### Phase 2: Client Portal (later, no rework)

* `client_users` mapping table
* `/portal` routes
* Client can edit only their own session
* Submit for review locks edits
* Admin approve/unlock controls

---

## 9. Developer Build Checklist (Step-by-step)

### DB & Policies

1. [ ] Add enums + add `workspace_id` columns
2. [ ] Create tables: `onboarding_sessions`, `onboarding_sections`, `files`, `section_comments`, `audit_logs`
3. [ ] Seed default session+sections on client creation (DB function or API)
4. [ ] Add RLS policies for each table

### API

5. [ ] `/api/clients` GET (filters + pagination)
6. [ ] `/api/clients` POST (create + create session + seed sections)
7. [ ] `/api/clients/:id` PATCH
8. [ ] `/api/clients/:id/onboarding` GET
9. [ ] `/api/clients/:id/onboarding/:section_key` PUT
10. [ ] `/api/.../files` POST
11. [ ] Comments GET/POST
12. [ ] Activity GET

### Frontend

13. [ ] Client list page with table + filters + debounced search
14. [ ] Client detail intake layout (two-column)
15. [ ] Checklist component (status badges + progress)
16. [ ] Section editor drawer with schema-driven fields
17. [ ] Notes editor (autosave or save button)
18. [ ] Follow-up actions:

    * Copy template to clipboard
    * Mark Done => update last_followup_at

### Follow-up template (copy text)

19. [ ] Template:
    “Hi — quick check-in on onboarding. We’re currently waiting on: {pending_sections}. Once we have those, we can move to the next step. Thanks!”

---

