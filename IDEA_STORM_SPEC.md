
# Idea Storm OS — Offline-First v1 (localStorage now, DB later)

## 1) Vision & Core Principles

### Vision

Build an **offline-first Idea Operating System** that lets you:

* capture raw ideas fast (“Inbox”)
* brainstorm in sessions (notes → clusters → promote)
* attach research with reliability scoring
* create evidence maps (claims + supports/contradicts)
* track experiments and outcomes
* log decisions with rationale
* convert validated ideas into execution board

### Core Principles

1. **Offline-first**: everything works without internet.
2. **Single source of truth**: one consistent data model across storage types.
3. **Event-based history**: every change produces an event (for audit + future sync).
4. **Deterministic IDs**: IDs generated client-side to enable offline creation.
5. **Phase gates**: rules prevent stage jumps without required artifacts.
6. **No rewrites later**: build with “storage adapter” pattern.

---

## 2) Roles & Permissions (offline-first compatible)

Even if you’re solo now, design roles now so DB later is easy.

* **Owner/Admin**

  * full CRUD, settings, decision finalization
* **Contributor**

  * create/edit ideas, research, sessions
  * vote
* **Viewer**

  * read + comment only

**Offline v1**: permissions are UI-enforced only.
**DB later**: enforce via RLS + policies.

---

## 3) Information Architecture / Pages

### Core Pages

* `/ideas` — Idea Vault (list + board)
* `/ideas/:id` — Idea Detail (tabs)
* `/storm` — Sessions list + “Start session”
* `/storm/:id` — Session Room (sticky grid + clustering)
* `/research` — Research Library + capture inbox
* `/decisions` — Prioritization board + decision log
* `/execution` — Kanban for Building ideas
* `/settings` — tags, scoring weights, templates (offline stored)

### Global UI Components

* “Quick Add” (idea)
* “Quick Capture” (research)
* Global search (ideas + research)

---

## 4) Offline-First Data Model (Canonical Schema)

### IMPORTANT RULE

Even in localStorage, store data in the **same shape** you’ll use in DB:

* normalized by entity type
* with consistent enums
* with timestamps + versioning
* with an event log

### Enums (canonical)

* `idea_stage`: `inbox | exploring | validated | building | shipped | archived`
* `research_type`: `article | video | paper | interview | competitor_analysis | user_feedback | internal_note`
* `confidence_level`: `low | medium | high | verified`
* `support_type`: `supports | contradicts | neutral`
* `decision_outcome`: `approved | rejected | deferred | needs_data`
* `brainstorm_method`: `free | crazy8s | scamper | reverse | five_whys | six_hats | swot | journey | mindmap | blind_voting`
* `experiment_status`: `planned | running | concluded`
* `experiment_outcome`: `validated | invalidated | inconclusive`
* `entity_type`: `idea | research | session | note | experiment | decision | comment | cluster | execution_card | settings`

### Entities (canonical objects)

#### `Idea`

* `id` (uuid)
* `title`
* `one_liner`
* `description` (markdown)
* `stage`
* `tags[]`
* `owner_id` (placeholder in offline)
* `created_at`, `updated_at`
* `canvas` (json):

  * `problem`, `user`, `value_prop`, `differentiation`
  * `assumptions[]`, `risks[]`, `mvp_scope[]`, `success_metrics[]`
* `scores` (json):

  * `ice`: { impact, confidence, ease, total }
  * `rice`: { reach, impact, confidence, effort, total }
  * `wsjf`: { user_value, time_criticality, risk_reduction, job_size, total }
* `links` (json):

  * `research_ids[]`, `experiment_ids[]`, `decision_ids[]`, `execution_card_ids[]`

#### `BrainstormSession`

* `id`
* `topic`
* `method`
* `status`: `active | completed`
* `participants[]` (offline: array of strings)
* `config`:

  * `timer_minutes`
  * `prompts[]`
  * `voting_enabled`
* `created_at`, `updated_at`

#### `BrainstormNote`

* `id`
* `session_id`
* `content`
* `author_id`
* `x`, `y` (grid position)
* `color`
* `cluster_id` (nullable)
* `votes` (number)
* `promoted_idea_id` (nullable)
* `created_at`, `updated_at`

#### `Cluster`

* `id`
* `session_id`
* `title`
* `note_ids[]`
* `votes_total`
* `created_at`, `updated_at`

#### `ResearchEntry`

* `id`
* `type`
* `url` (optional for offline)
* `title`
* `summary`
* `key_insights[]`
* `why_it_matters`
* `reliability_score` (0–5)
* `captured_at`
* `tags[]`

#### `EvidenceLink`

(junction: idea ↔ research with a claim)

* `id`
* `idea_id`
* `research_id`
* `claim`
* `support_type`
* `confidence`
* `created_at`

#### `Experiment`

* `id`
* `idea_id`
* `hypothesis`
* `status`
* `outcome`
* `design` (json): steps, sample, timeline
* `metrics` (json): target vs actual
* `notes`
* `attachments[]` (offline: base64 optional OR file refs)
* `created_at`, `updated_at`

#### `DecisionLog`

* `id`
* `idea_id`
* `outcome`
* `rationale`
* `tradeoffs[]`
* `participants[]`
* `reversible`: boolean
* `snapshot` (json): stage + scores + key evidence refs at time
* `created_at`

#### `ExecutionCard`

* `id`
* `idea_id`
* `title`
* `status`: `planned | in_progress | blocked | done`
* `description`
* `due_date`
* `created_at`, `updated_at`

#### `Comment`

* `id`
* `entity_type`
* `entity_id`
* `content`
* `author_id`
* `created_at`

#### `Settings`

* `id = "default"`
* `tags_default[]`
* `categories_default[]`
* `scoring_weights` (json)
* `stage_gates` (rules config)
* `templates` (brainstorm prompts, follow-up prompts)

---

## 5) Offline Storage Architecture (localStorage done RIGHT)

### Must-have: Storage Adapter Pattern

Build your app against an interface, not localStorage directly.

#### Interface (conceptual)

* `get(entityType, id)`
* `list(entityType, query)`
* `upsert(entityType, object)`
* `remove(entityType, id)`
* `transaction(ops[])`
* `appendEvent(event)`
* `listEvents(since)`

### Local storage structure (single keyspace)

Use 2 top-level keys (stable for migration):

* `ios_state_v1`
* `ios_events_v1`

#### `ios_state_v1` shape (normalized)

```json
{
  "meta": { "schema_version": 1, "updated_at": "..." },
  "ideas": { "id1": {...}, "id2": {...} },
  "sessions": { "sid1": {...} },
  "notes": { "nid1": {...} },
  "clusters": { "cid1": {...} },
  "research": { "rid1": {...} },
  "evidence": { "eid1": {...} },
  "experiments": { "xid1": {...} },
  "decisions": { "did1": {...} },
  "execution": { "kid1": {...} },
  "comments": { "cm1": {...} },
  "settings": { "default": {...} }
}
```

#### `ios_events_v1` shape (append-only)

```json
[
  {
    "event_id": "uuid",
    "ts": "2026-01-02T10:00:00.000Z",
    "actor_id": "local_user",
    "action": "UPSERT",
    "entity_type": "idea",
    "entity_id": "uuid",
    "before": {...},
    "after": {...}
  }
]
```

### Why event log matters

When you move to DB later, you can:

* replay events to sync data
* resolve conflicts
* keep audit history

---

## 6) Core Workflows (Step-by-step with offline rules)

### Workflow A: Quick Capture → Inbox

1. Quick Add idea (title + one-liner)
2. Save creates:

   * Idea object
   * Event log entry
3. Idea appears in Inbox list and Funnel count updates

### Workflow B: Brainstorm Session → Notes → Clusters → Promote

1. Create session (method + timer)
2. Add notes rapidly (each note is stored instantly)
3. Cluster notes (drag into clusters)
4. Vote (each click updates note/cluster votes)
5. Promote:

   * creates new Idea from cluster title + top notes
   * marks notes with `promoted_idea_id`

### Workflow C: Research Capture → Link to Idea

1. Capture research (url optional)
2. Fill summary + key insights + why it matters
3. Link to idea(s)
4. Add evidence claims:

   * one claim per evidence link
   * mark supports/contradicts
5. Gate rule:

   * cannot move idea to `validated` unless:

     * at least 3 evidence links OR 1 concluded experiment

### Workflow D: Experiment → Outcome → Confidence

1. Create experiment with hypothesis
2. Move to running
3. Conclude with outcome + metrics
4. Auto-update idea stage suggestion:

   * validated if outcome validated and evidence count threshold met

### Workflow E: Decision Log → Move Stage

1. Open decision modal from idea
2. Choose outcome
3. Save decision snapshot (scores + evidence count)
4. If outcome approved: stage moves to building (only if gates satisfied)

---

## 7) Research Reliability Rubric (0–5) — improved

* **0**: rumor/meme/no source
* **1**: single anecdote / comment / unverified screenshot
* **2**: multiple anecdotes but no methodology
* **3**: credible publication OR competitor official material
* **4**: multiple credible sources + consistent signals OR structured interviews
* **5**: peer-reviewed OR statistically significant internal/primary data

**UI**: show color badge + tooltip definition.

---

## 8) Ideation Toolkit — 12 Methods (UI-support details)

1. Free Brain Dump — unlimited sticky notes, no prompts
2. Crazy 8s — timer + auto “next round” every minute
3. SCAMPER — prompt wizard with 7 steps, notes tagged per step
4. Reverse Brainstorm — “make it fail” column → “reverse fix” column
5. 5 Whys — tree view: Why1→Why5 nodes
6. Six Thinking Hats — mode switch button changes prompt + note color
7. SWOT — 2x2 grid with four lanes
8. Journey Map — timeline lanes: Awareness→Activation→Retention
9. Mind Map — node graph (simple parent-child)
10. Blind Voting — notes hidden until end, then reveal + vote
11. Assumption Storm — auto-creates assumption cards in idea canvas
12. Constraint Sprint — set constraints (time, budget, tech), generate notes within constraints

---

## 9) Prioritization & Decision System (flawless + consistent)

### Scoring inputs stored separately

Store components, compute totals deterministically.

**ICE**

* impact (1–10)
* confidence (1–10)
* ease (1–10)
* total = (impact * confidence * ease) / 10

**RICE**

* reach (0–100000)
* impact (0.25, 0.5, 1, 2, 3)
* confidence (0–100)
* effort (0.5–12 person-month)
* total = (reach * impact * (confidence/100)) / effort

### Decision Log (append-only policy even offline)

* you can add a “follow-up decision”
* but you cannot edit old decision (only “supersede”)

Decision fields required:

* outcome
* rationale
* reversible (true/false)
* confidence level at time
* participants list (offline)
* snapshot: stage + scores + evidence count + experiment outcomes

---

## 10) API Routes (for FUTURE DB) — keep now as service layer

Even offline, implement your app calling “services” like:

* `IdeaService.create()`
* `ResearchService.capture()`
  and later those services call API.

Future REST routes:

* `GET /api/ideas`
* `POST /api/ideas`
* `PATCH /api/ideas/:id`
* `POST /api/storm/sessions`
* `POST /api/storm/sessions/:id/notes`
* `POST /api/research`
* `POST /api/ideas/:id/evidence`
* `POST /api/ideas/:id/experiments`
* `POST /api/ideas/:id/decisions`
* `GET /api/funnel`
* `GET /api/activity`

**Key point for you now**: implement the same request/response objects locally, so migration is trivial.

---

## 11) Non-Functional Requirements (offline-first)

### Data integrity

* every entity has `created_at`, `updated_at`
* every change appends an event
* use `schema_version` to support upgrades

### Performance

* list views use indexes in memory (build derived views)
* store “computed funnel counts” in memory, not in storage

### Backups (critical for local-only)

Add a settings button:

* **Export JSON backup** (downloads `ios_state_v1 + ios_events_v1`)
* **Import backup** (merge with existing)

### Safety

* prevent localStorage wipe loss: show reminder “Export backup” monthly (optional)

---

## 12) Phased Roadmap (realistic)

### Phase 1 (Local MVP — must ship)

* Ideas vault (list + board)
* Idea detail (canvas + scores)
* Research capture + link to ideas
* Decisions log
* Export/Import backup

### Phase 2 (Storm)

* Brainstorm sessions + notes + clustering + voting
* Promote to idea
* Evidence map tab

### Phase 3 (Execution)

* Experiment tracker
* Execution kanban
* “Build gate” rules

### Phase 4 (DB migration)

* Replace storage adapter with Supabase adapter
* Add auth + workspace + RLS
* Add realtime collaboration

---

## 13) Developer Build Checklist (offline-first)

### Data layer

1. Create canonical TS types for all entities + enums
2. Implement `StorageAdapter` interface
3. Implement `LocalAdapter` using `ios_state_v1` and `ios_events_v1`
4. Implement `EventLog.append()` on every mutation
5. Add `Export/Import` with version validation

### Services

6. Create service modules:

   * IdeaService
   * ResearchService
   * SessionService
   * DecisionService
7. Services use adapter (no direct localStorage access in UI)

### UI

8. Build `/ideas` list + filter + search
9. Build idea detail tabs (Canvas, Research, Evidence, Experiments, Decisions)
10. Build quick add + quick capture modals
11. Build `/decisions` board (leaderboard + decision modal)
12. Build `/research` library

### Quality rules

13. Add stage gate validator (pure function)
14. Add scoring calculator (pure function)
15. Add unit tests for:

* scoring
* stage gates
* event log append
* import/export merge

---

# The exact prompt you can give to an AI (super detailed)

```text
You are a senior full-stack architect. Design an OFFLINE-FIRST “Idea Storm OS” web app that works using localStorage now, but can migrate to Supabase/Postgres later WITHOUT rewriting UI/business logic.

Hard requirements:
- Use a Storage Adapter pattern: LocalAdapter now, SupabaseAdapter later.
- Store state in normalized localStorage keys: ios_state_v1 and ios_events_v1 (append-only event log).
- Provide canonical TS types, enums, entity schemas, and pure functions for scoring + stage gates.
- Provide UI wireframes (ASCII) for Dashboard, Ideas Vault, Idea Detail tabs, Research Capture modal, Brainstorm Session room, Prioritization Board, Decision Log view, Execution Kanban.
- Provide a full workflow spec for: Capture → Brainstorm → Research → Evidence → Experiment → Decision → Execution.
- Provide Export/Import backup format and merge strategy.
- Provide a migration plan from localStorage to Supabase (how to replay events, how to resolve conflicts).
- No real organization names, addresses, or personal names. Use placeholders only.

Output headings (exact):
1) Offline-First Architecture
2) Canonical Data Model (Types + Enums)
3) localStorage Schema (ios_state_v1, ios_events_v1)
4) Core Workflows (step-by-step)
5) Stage Gates + Scoring (pure functions)
6) UI Wireframes (ASCII)
7) Backup/Restore + Merge Strategy
8) Future Supabase API + RLS Outline
9) Phased Roadmap
10) Developer Implementation Checklist
```

---
