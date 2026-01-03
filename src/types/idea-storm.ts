export type EntityType =
    | 'idea'
    | 'research'
    | 'session'
    | 'note'
    | 'experiment'
    | 'decision'
    | 'comment'
    | 'cluster'
    | 'execution_card'
    | 'settings'

export type IdeaStage = 'inbox' | 'exploring' | 'validated' | 'building' | 'shipped' | 'archived'
export type ResearchType = 'article' | 'video' | 'paper' | 'interview' | 'competitor_analysis' | 'user_feedback' | 'internal_note'
export type SupportType = 'supports' | 'contradicts' | 'neutral'
export type DecisionOutcome = 'approved' | 'rejected' | 'deferred' | 'needs_data'
export type ExperimentStatus = 'planned' | 'running' | 'concluded'
export type ExperimentOutcome = 'validated' | 'invalidated' | 'inconclusive'

export interface BaseEntity {
    id: string
    created_at: string
    updated_at: string
}

export interface Idea extends BaseEntity {
    title: string
    one_liner: string
    description: string // markdown
    stage: IdeaStage
    tags: string[]
    owner_id: string
    canvas: {
        problem: string
        user: string
        value_prop: string
        differentiation: string
        assumptions: string[]
        risks: string[]
        mvp_scope: string[]
        success_metrics: string[]
    }
    scores: {
        ice: { impact: number, confidence: number, ease: number, total: number }
        rice: { reach: number, impact: number, confidence: number, effort: number, total: number }
    }
    link_ids: {
        research: string[]
        experiments: string[]
        decisions: string[]
        execution_cards: string[]
    }
}

export interface ResearchEntry extends BaseEntity {
    type: ResearchType
    url?: string
    title: string
    summary: string
    key_insights: string[]
    why_it_matters: string
    reliability_score: number // 0-5
    tags: string[]
}

export interface BrainstormSession extends BaseEntity {
    topic: string
    method: string // 'crazy8s', etc
    status: 'active' | 'completed'
    participants: string[]
    config: {
        timer_minutes: number
        prompts: string[]
        voting_enabled: boolean
    }
}

export interface BrainstormNote extends BaseEntity {
    session_id: string
    content: string
    author_id: string
    x: number
    y: number
    color: string
    cluster_id?: string
    votes: number
}

export interface DecisionLog extends BaseEntity {
    idea_id: string
    outcome: DecisionOutcome
    rationale: string
    tradeoffs: string[]
    participants: string[]
    reversible: boolean
    snapshot: any // JSON of idea state at time
}

// Event Log for Sync/Audit
export interface IOSEvent {
    event_id: string
    ts: string
    actor_id: string
    action: 'UPSERT' | 'DELETE'
    entity_type: EntityType
    entity_id: string
    before?: any
    after?: any
}

export interface IOSStateV1 {
    meta: { schema_version: number, updated_at: string }
    ideas: Record<string, Idea>
    sessions: Record<string, BrainstormSession>
    notes: Record<string, BrainstormNote>
    research: Record<string, ResearchEntry>
    decisions: Record<string, DecisionLog>
    // add others as needed
}
