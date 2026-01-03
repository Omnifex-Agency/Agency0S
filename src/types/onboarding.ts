export type ClientStage = 'lead' | 'confirmed' | 'onboarding' | 'in_progress' | 'delivered' | 'closed'
export type PriorityLevel = 'low' | 'medium' | 'high'
export type OnboardingStatus = 'not_started' | 'incomplete' | 'submitted' | 'approved'
export type SectionStatus = 'draft' | 'waiting' | 'done' | 'changes_requested'
export type SectionKey = 'basic_info' | 'requirements' | 'assets' | 'access' | 'billing'

export interface Client {
    id: string
    workspace_id: string
    // ... existing fields
    company_name: string
    website?: string
    primary_contact_name?: string
    primary_contact_email?: string
    primary_contact_role?: string
    // New fields
    stage: ClientStage
    onboarding_status: OnboardingStatus
    priority: PriorityLevel
    owner_id?: string
    start_date?: string
    target_date?: string
    last_followup_at?: string
    intake_notes?: string
    contact_phone?: string
    created_at: string
    updated_at: string
}

export interface OnboardingSession {
    id: string
    workspace_id: string
    client_id: string
    template_key: string
    status: OnboardingStatus
    completion_percentage: number
    created_at: string
    updated_at: string
    submitted_at?: string
    approved_at?: string
}

export interface OnboardingSection {
    id: string
    workspace_id: string
    session_id: string
    section_key: SectionKey
    status: SectionStatus
    data: Record<string, any>
    assigned_to?: string
    created_at: string
    updated_at: string
}

export interface IntakeFile {
    id: string
    workspace_id: string
    client_id: string
    session_id?: string
    section_id?: string
    file_key: string
    kind: 'upload' | 'link'
    url: string
    filename?: string
    mime_type?: string
    size_bytes?: number
    created_at: string
}

export interface SectionComment {
    id: string
    workspace_id: string
    section_id: string
    user_id?: string
    content: string
    created_at: string
}
