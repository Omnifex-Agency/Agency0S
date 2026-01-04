import { adapter } from "@/lib/storage-adapter"
import { DecisionLog, Idea, IdeaStage, ResearchEntry, BrainstormSession, BrainstormNote } from "@/types/idea-storm"

// --- Pure Functions ---

export function calculateRICE(scores: { reach: number, impact: number, confidence: number, effort: number }) {
    if (scores.effort === 0) return 0
    return Math.round((scores.reach * scores.impact * (scores.confidence / 100)) / scores.effort)
}

export function calculateICE(scores: { impact: number, confidence: number, ease: number }) {
    return Math.round((scores.impact * scores.confidence * scores.ease) / 10) // Normalize? Usually just mult.
}

// --- Services ---

export const IdeaService = {
    async create(data: Partial<Idea>) {
        const id = crypto.randomUUID()
        const newIdea: Idea = {
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            title: data.title || "Untitled Idea",
            one_liner: data.one_liner || "",
            description: data.description || "",
            stage: "inbox",
            tags: data.tags || [],
            owner_id: "local_user",
            canvas: data.canvas || {
                problem: "", user: "", value_prop: "", differentiation: "",
                assumptions: [], risks: [], mvp_scope: [], success_metrics: []
            },
            scores: data.scores || {
                ice: { impact: 5, confidence: 5, ease: 5, total: 125 },
                rice: { reach: 1000, impact: 1, confidence: 80, effort: 4, total: 200 }
            },
            link_ids: { research: [], experiments: [], decisions: [], execution_cards: [] }
        }
        return await adapter.upsert('idea', newIdea)
    },

    async update(id: string, updates: Partial<Idea>) {
        const existing = await adapter.get<Idea>('idea', id)
        if (!existing) throw new Error("Idea not found")

        const updated = { ...existing, ...updates, updated_at: new Date().toISOString() }

        // Auto-recalc scores if relevant fields changed
        if (updates.scores) {
            updated.scores.rice.total = calculateRICE(updated.scores.rice)
            updated.scores.ice.total = calculateICE(updated.scores.ice)
        }

        return await adapter.upsert('idea', updated)
    },

    async list(stage?: IdeaStage) {
        return await adapter.list<Idea>('idea', (item) => !stage || item.stage === stage)
    },

    async get(id: string) {
        return await adapter.get<Idea>('idea', id)
    },

    async moveStage(id: string, stage: IdeaStage) {
        // Here we could add "Gate Rules" check
        // e.g. if (stage === 'building' && !hasApprovedDecision) throw Error...
        return this.update(id, { stage })
    }
}


export const ResearchService = {
    async create(data: Partial<ResearchEntry>) {
        const id = crypto.randomUUID()
        const entry: ResearchEntry = {
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            type: data.type || 'internal_note',
            title: data.title || "Untitled Note",
            url: data.url,
            summary: data.summary || "",
            key_insights: data.key_insights || [],
            why_it_matters: data.why_it_matters || "",
            reliability_score: data.reliability_score || 0,
            tags: data.tags || []
        }
        return await adapter.upsert('research', entry)
    },

    async list() {
        return await adapter.list<ResearchEntry>('research')
    }
}

export const DecisionService = {
    async log(data: Partial<DecisionLog>) {
        const id = crypto.randomUUID()
        const entry: DecisionLog = {
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            idea_id: data.idea_id!,
            outcome: data.outcome || 'needs_data',
            rationale: data.rationale || "",
            tradeoffs: data.tradeoffs || [],
            participants: data.participants || [],
            reversible: data.reversible ?? true,
            snapshot: data.snapshot || {}
        }
        return await adapter.upsert('decision', entry)
    },

    async list(ideaId?: string) {
        return await adapter.list<DecisionLog>('decision', (item) => !ideaId || item.idea_id === ideaId)
    }
}

export const SessionService = {
    async create(data: Partial<BrainstormSession>) {
        const id = crypto.randomUUID()
        const session: BrainstormSession = {
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            topic: data.topic || "Untitled Session",
            method: data.method || "free",
            status: 'active',
            participants: data.participants || [],
            config: data.config || { timer_minutes: 5, prompts: [], voting_enabled: false }
        }
        return await adapter.upsert('session', session)
    },

    async list() {
        return await adapter.list<BrainstormSession>('session')
    },

    async get(id: string) {
        return await adapter.get<BrainstormSession>('session', id)
    },

    async addNote(sessionId: string, content: string, color: string = 'yellow') {
        const id = crypto.randomUUID()
        const note: BrainstormNote = {
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            session_id: sessionId,
            content,
            author_id: 'local_user',
            x: 0, // Default positions, UI can update
            y: 0,
            color,
            votes: 0
        }
        return await adapter.upsert('note', note)
    },

    async listNotes(sessionId: string) {
        return await adapter.list<BrainstormNote>('note', (n) => n.session_id === sessionId)
    },

    async updateNote(id: string, updates: Partial<BrainstormNote>) {
        const existing = await adapter.get<BrainstormNote>('note', id)
        if (!existing) throw new Error("Note not found")
        const updated = { ...existing, ...updates, updated_at: new Date().toISOString() }
        return await adapter.upsert('note', updated)
    },

    async deleteNote(id: string) {
        return await adapter.remove('note', id)
    }
}
