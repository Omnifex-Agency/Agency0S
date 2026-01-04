import { BaseEntity, EntityType, IOSEvent, IOSStateV1 } from "@/types/idea-storm"

const STORAGE_KEY_STATE = "ios_state_v1"
const STORAGE_KEY_EVENTS = "ios_events_v1"

export interface StorageAdapter {
    get<T extends BaseEntity>(type: EntityType, id: string): Promise<T | null>
    list<T extends BaseEntity>(type: EntityType, filter?: (item: T) => boolean): Promise<T[]>
    upsert<T extends BaseEntity>(type: EntityType, item: T): Promise<T>
    remove(type: EntityType, id: string): Promise<void>
    exportBackup(): Promise<{ state: IOSStateV1, events: IOSEvent[] }>
    importBackup(backup: { state: IOSStateV1, events: IOSEvent[] }): Promise<void>
}

// Initial Empty State
const INITIAL_STATE: IOSStateV1 = {
    meta: { schema_version: 1, updated_at: new Date().toISOString() },
    ideas: {},
    sessions: {},
    notes: {},
    research: {},
    decisions: {}
    // extend for others
}

export class LocalAdapter implements StorageAdapter {
    private state: IOSStateV1
    private events: IOSEvent[] = []

    constructor() {
        if (typeof window !== "undefined") {
            const storedState = localStorage.getItem(STORAGE_KEY_STATE)
            const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS)

            this.state = storedState ? JSON.parse(storedState) : INITIAL_STATE
            this.events = storedEvents ? JSON.parse(storedEvents) : []
        } else {
            this.state = INITIAL_STATE
        }
    }

    private persist() {
        if (typeof window === "undefined") return
        this.state.meta.updated_at = new Date().toISOString()
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(this.state))
        localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.events))
    }

    private logEvent(action: 'UPSERT' | 'DELETE', type: EntityType, id: string, before?: any, after?: any) {
        const event: IOSEvent = {
            event_id: crypto.randomUUID(),
            ts: new Date().toISOString(),
            actor_id: 'local_user', // placeholder
            action,
            entity_type: type,
            entity_id: id,
            before,
            after
        }
        this.events.push(event)
    }

    private getConfigMap(type: EntityType): Record<string, any> | undefined {
        switch (type) {
            case 'idea': return this.state.ideas
            case 'session': return this.state.sessions
            case 'note': return this.state.notes
            case 'research': return this.state.research
            case 'decision': return this.state.decisions
            default: return undefined
        }
    }

    async get<T extends BaseEntity>(type: EntityType, id: string): Promise<T | null> {
        const map = this.getConfigMap(type)
        if (!map) return null
        return (map[id] as T) || null
    }

    async list<T extends BaseEntity>(type: EntityType, filter?: (item: T) => boolean): Promise<T[]> {
        const map = this.getConfigMap(type)
        if (!map) return []
        const values = Object.values(map) as T[]
        return filter ? values.filter(filter) : values
    }

    async upsert<T extends BaseEntity>(type: EntityType, item: T): Promise<T> {
        const map = this.getConfigMap(type)
        if (!map) throw new Error(`Entity type ${type} not supported in LocalAdapter`)

        const before = map[item.id] ? JSON.parse(JSON.stringify(map[item.id])) : undefined

        // Ensure timestamps
        const now = new Date().toISOString()
        if (!item.created_at) item.created_at = now
        item.updated_at = now

        map[item.id] = item
        this.logEvent('UPSERT', type, item.id, before, item)
        this.persist()

        return item
    }

    async remove(type: EntityType, id: string): Promise<void> {
        const map = this.getConfigMap(type)
        if (!map) return

        const before = map[id]
        if (!before) return

        delete map[id]
        this.logEvent('DELETE', type, id, before, undefined)
        this.persist()
    }

    async exportBackup() {
        return { state: this.state, events: this.events }
    }

    async importBackup(backup: { state: IOSStateV1, events: IOSEvent[] }) {
        this.state = backup.state
        this.events = backup.events
        this.persist()
    }
}

// Singleton instance
export const adapter = new LocalAdapter()
