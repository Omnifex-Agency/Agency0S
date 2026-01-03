export type Database = {
    public: {
        Tables: {
            workspaces: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            workspace_members: {
                Row: {
                    id: string
                    workspace_id: string
                    user_id: string
                    role: 'owner' | 'admin' | 'member'
                    created_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    user_id: string
                    role?: 'owner' | 'admin' | 'member'
                    created_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    user_id?: string
                    role?: 'owner' | 'admin' | 'member'
                    created_at?: string
                }
            }
            clients: {
                Row: {
                    id: string
                    workspace_id: string
                    company_name: string
                    website: string | null
                    industry: string | null
                    status: string
                    health_score: number | null
                    owner_id: string | null
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    company_name: string
                    website?: string | null
                    industry?: string | null
                    status?: string
                    health_score?: number | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    company_name?: string
                    website?: string | null
                    industry?: string | null
                    status?: string
                    health_score?: number | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            contacts: {
                Row: {
                    id: string
                    client_id: string
                    full_name: string
                    email: string | null
                    phone: string | null
                    job_title: string | null
                    is_primary: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    client_id: string
                    full_name: string
                    email?: string | null
                    phone?: string | null
                    job_title?: string | null
                    is_primary?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    client_id?: string
                    full_name?: string
                    email?: string | null
                    phone?: string | null
                    job_title?: string | null
                    is_primary?: boolean
                    created_at?: string
                }
            }
            leads: {
                Row: {
                    id: string
                    workspace_id: string
                    client_id: string
                    title: string
                    description: string | null
                    stage: string
                    estimated_value: number | null
                    probability: number | null
                    expected_close_date: string | null
                    next_action: string | null
                    last_contacted_at: string | null
                    owner_id: string | null
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    client_id: string
                    title: string
                    description?: string | null
                    stage?: string
                    estimated_value?: number | null
                    probability?: number | null
                    expected_close_date?: string | null
                    next_action?: string | null
                    last_contacted_at?: string | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    client_id?: string
                    title?: string
                    description?: string | null
                    stage?: string
                    estimated_value?: number | null
                    probability?: number | null
                    expected_close_date?: string | null
                    next_action?: string | null
                    last_contacted_at?: string | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    workspace_id: string
                    title: string
                    description: string | null
                    status: string
                    priority: string
                    due_date: string | null
                    completed_at: string | null
                    assignee_id: string | null
                    client_id: string | null
                    lead_id: string | null
                    project_id: string | null
                    research_id: string | null
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    title: string
                    description?: string | null
                    status?: string
                    priority?: string
                    due_date?: string | null
                    completed_at?: string | null
                    assignee_id?: string | null
                    client_id?: string | null
                    lead_id?: string | null
                    project_id?: string | null
                    research_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    title?: string
                    description?: string | null
                    status?: string
                    priority?: string
                    due_date?: string | null
                    completed_at?: string | null
                    assignee_id?: string | null
                    client_id?: string | null
                    lead_id?: string | null
                    project_id?: string | null
                    research_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    workspace_id: string
                    client_id: string
                    name: string
                    description: string | null
                    status: string
                    start_date: string | null
                    end_date: string | null
                    budget: number | null
                    owner_id: string | null
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    client_id: string
                    name: string
                    description?: string | null
                    status?: string
                    start_date?: string | null
                    end_date?: string | null
                    budget?: number | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    client_id?: string
                    name?: string
                    description?: string | null
                    status?: string
                    start_date?: string | null
                    end_date?: string | null
                    budget?: number | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            research: {
                Row: {
                    id: string
                    workspace_id: string
                    client_id: string
                    title: string
                    type: string
                    status: string
                    content: any | null
                    owner_id: string | null
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    client_id: string
                    title: string
                    type: string
                    status?: string
                    content?: any | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    client_id?: string
                    title?: string
                    type?: string
                    status?: string
                    content?: any | null
                    owner_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            notes: {
                Row: {
                    id: string
                    workspace_id: string
                    client_id: string
                    title: string
                    content: string | null
                    note_type: string
                    meeting_date: string | null
                    lead_id: string | null
                    created_by_id: string | null
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    client_id: string
                    title: string
                    content?: string | null
                    note_type?: string
                    meeting_date?: string | null
                    lead_id?: string | null
                    created_by_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    client_id?: string
                    title?: string
                    content?: string | null
                    note_type?: string
                    meeting_date?: string | null
                    lead_id?: string | null
                    created_by_id?: string | null
                    tags?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }

            target_research: {
                Row: {
                    id: string
                    workspace_id: string
                    target_id: string
                    type: string
                    title: string
                    content: any
                    created_by_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    target_id: string
                    type: string
                    title: string
                    content?: any
                    created_by_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    target_id?: string
                    type?: string
                    title?: string
                    content?: any
                    created_by_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            targets: {
                Row: {
                    id: string
                    workspace_id: string
                    company_name: string
                    website: string | null
                    industry: string | null
                    status: "new" | "identifying" | "researching" | "ready_to_pitch" | "pitching" | "converted" | "discarded"
                    primary_contact_name: string | null
                    primary_contact_email: string | null
                    primary_contact_role: string | null
                    tags: string[] | null
                    confidence_score: number | null
                    last_contacted_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    company_name: string
                    website?: string | null
                    industry?: string | null
                    status?: "new" | "identifying" | "researching" | "ready_to_pitch" | "pitching" | "converted" | "discarded"
                    primary_contact_name?: string | null
                    primary_contact_email?: string | null
                    primary_contact_role?: string | null
                    tags?: string[] | null
                    confidence_score?: number | null
                    last_contacted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    company_name?: string
                    website?: string | null
                    industry?: string | null
                    status?: "new" | "identifying" | "researching" | "ready_to_pitch" | "pitching" | "converted" | "discarded"
                    primary_contact_name?: string | null
                    primary_contact_email?: string | null
                    primary_contact_role?: string | null
                    tags?: string[] | null
                    confidence_score?: number | null
                    last_contacted_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            ideas: {
                Row: {
                    id: string
                    workspace_id: string
                    title: string
                    status: "new" | "validating" | "refined" | "approved" | "turned_into_project" | "parked" | "rejected"
                    problem: string | null
                    insight: string | null
                    hypothesis: string | null
                    execution_plan: string | null
                    metrics: string | null
                    risks: string | null
                    next_steps: string | null
                    template_type: string | null
                    assets: any | null
                    tags: string[] | null
                    related_client_id: string | null
                    related_project_id: string | null
                    owner_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    title: string
                    status?: "new" | "validating" | "refined" | "approved" | "turned_into_project" | "parked" | "rejected"
                    problem?: string | null
                    insight?: string | null
                    hypothesis?: string | null
                    execution_plan?: string | null
                    metrics?: string | null
                    risks?: string | null
                    next_steps?: string | null
                    template_type?: string | null
                    assets?: any | null
                    tags?: string[] | null
                    related_client_id?: string | null
                    related_project_id?: string | null
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    title?: string
                    status?: "new" | "validating" | "refined" | "approved" | "turned_into_project" | "parked" | "rejected"
                    problem?: string | null
                    insight?: string | null
                    hypothesis?: string | null
                    execution_plan?: string | null
                    metrics?: string | null
                    risks?: string | null
                    next_steps?: string | null
                    template_type?: string | null
                    assets?: any | null
                    tags?: string[] | null
                    related_client_id?: string | null
                    related_project_id?: string | null
                    owner_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            onboarding_sessions: {
                Row: {
                    id: string
                    workspace_id: string
                    client_id: string
                    template_key: string | null
                    status: "not_started" | "incomplete" | "submitted" | "approved"
                    completion_percentage: number | null
                    created_at: string
                    updated_at: string
                    submitted_at: string | null
                    approved_at: string | null
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    client_id: string
                    template_key?: string | null
                    status?: "not_started" | "incomplete" | "submitted" | "approved"
                    completion_percentage?: number | null
                    created_at?: string
                    updated_at?: string
                    submitted_at?: string | null
                    approved_at?: string | null
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    client_id?: string
                    template_key?: string | null
                    status?: "not_started" | "incomplete" | "submitted" | "approved"
                    completion_percentage?: number | null
                    created_at?: string
                    updated_at?: string
                    submitted_at?: string | null
                    approved_at?: string | null
                }
            }
            onboarding_sections: {
                Row: {
                    id: string
                    workspace_id: string
                    session_id: string
                    section_key: string
                    status: "draft" | "waiting" | "done" | "changes_requested"
                    data: any | null
                    assigned_to: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    session_id: string
                    section_key: string
                    status?: "draft" | "waiting" | "done" | "changes_requested"
                    data?: any | null
                    assigned_to?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    session_id?: string
                    section_key?: string
                    status?: "draft" | "waiting" | "done" | "changes_requested"
                    data?: any | null
                    assigned_to?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            intake_files: {
                Row: {
                    id: string
                    workspace_id: string
                    client_id: string
                    session_id: string | null
                    section_id: string | null
                    file_key: string
                    kind: string
                    url: string
                    filename: string | null
                    mime_type: string | null
                    size_bytes: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    client_id: string
                    session_id?: string | null
                    section_id?: string | null
                    file_key: string
                    kind: string
                    url: string
                    filename?: string | null
                    mime_type?: string | null
                    size_bytes?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    client_id?: string
                    session_id?: string | null
                    section_id?: string | null
                    file_key?: string
                    kind?: string
                    url?: string
                    filename?: string | null
                    mime_type?: string | null
                    size_bytes?: number | null
                    created_at?: string
                }
            }
            section_comments: {
                Row: {
                    id: string
                    workspace_id: string
                    section_id: string
                    user_id: string | null
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    section_id: string
                    user_id?: string | null
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    section_id?: string
                    user_id?: string | null
                    content?: string
                    created_at?: string
                }
            }
            activity_logs: {
                Row: {
                    id: string
                    workspace_id: string
                    actor_id: string | null
                    action: string
                    entity_type: string
                    entity_id: string | null
                    before_state: any | null
                    after_state: any | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    workspace_id: string
                    actor_id?: string | null
                    action: string
                    entity_type: string
                    entity_id?: string | null
                    before_state?: any | null
                    after_state?: any | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    workspace_id?: string
                    actor_id?: string | null
                    action?: string
                    entity_type?: string
                    entity_id?: string | null
                    before_state?: any | null
                    after_state?: any | null
                    created_at?: string
                }
            }
        }
    }
}
