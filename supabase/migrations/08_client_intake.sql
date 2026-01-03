-- Enums
CREATE TYPE client_stage AS ENUM ('lead', 'confirmed', 'onboarding', 'in_progress', 'delivered', 'closed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE onboarding_status AS ENUM ('not_started', 'incomplete', 'submitted', 'approved');
CREATE TYPE section_status AS ENUM ('draft', 'waiting', 'done', 'changes_requested');
-- We use text for section_key to allow future flexibility, but can enforce via validation
-- CREATE TYPE section_key AS ENUM ('basic_info', 'requirements', 'assets', 'access', 'billing');

-- Alter Clients Table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS stage client_stage NOT NULL DEFAULT 'lead',
ADD COLUMN IF NOT EXISTS onboarding_status onboarding_status DEFAULT 'not_started',
ADD COLUMN IF NOT EXISTS priority priority_level DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS target_date DATE,
ADD COLUMN IF NOT EXISTS last_followup_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS intake_notes TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Create Onboarding Sessions
CREATE TABLE IF NOT EXISTS onboarding_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_key TEXT DEFAULT 'default_v1',
    status onboarding_status DEFAULT 'not_started',
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submitted_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_onboarding_sessions_client_id ON onboarding_sessions(client_id);
ALTER TABLE onboarding_sessions ENABLE ROW LEVEL SECURITY;

-- Create Onboarding Sections
CREATE TABLE IF NOT EXISTS onboarding_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    session_id UUID NOT NULL REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    section_key TEXT NOT NULL, -- basic_info, requirements, etc.
    status section_status DEFAULT 'draft',
    data JSONB DEFAULT '{}'::jsonb,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, section_key)
);

CREATE INDEX idx_onboarding_sections_session_id ON onboarding_sections(session_id);
ALTER TABLE onboarding_sections ENABLE ROW LEVEL SECURITY;

-- Create Files (Intake specific for now, but generic schema)
CREATE TABLE IF NOT EXISTS intake_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    session_id UUID REFERENCES onboarding_sessions(id) ON DELETE CASCADE,
    section_id UUID REFERENCES onboarding_sections(id) ON DELETE SET NULL,
    file_key TEXT NOT NULL, -- context e.g. 'logo'
    kind TEXT NOT NULL, -- 'upload' or 'link'
    url TEXT NOT NULL,
    filename TEXT,
    mime_type TEXT,
    size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_intake_files_session_id ON intake_files(session_id);
ALTER TABLE intake_files ENABLE ROW LEVEL SECURITY;

-- Create Section Comments
CREATE TABLE IF NOT EXISTS section_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    section_id UUID NOT NULL REFERENCES onboarding_sections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_section_comments_section_id ON section_comments(section_id);
ALTER TABLE section_comments ENABLE ROW LEVEL SECURITY;

-- Create Audit Logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g. 'update_section'
    entity_type TEXT NOT NULL, -- 'section', 'client'
    entity_id UUID,
    before_state JSONB,
    after_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_workspace_id ON activity_logs(workspace_id);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Standard Workspace Isolation)

-- Sessions
CREATE POLICY "Users can view sessions in their workspace" ON onboarding_sessions
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert sessions in their workspace" ON onboarding_sessions
    FOR INSERT WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update sessions in their workspace" ON onboarding_sessions
    FOR UPDATE USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete sessions in their workspace" ON onboarding_sessions
    FOR DELETE USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Sections
CREATE POLICY "Users can view sections in their workspace" ON onboarding_sections
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert sections in their workspace" ON onboarding_sections
    FOR INSERT WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update sections in their workspace" ON onboarding_sections
    FOR UPDATE USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Files
CREATE POLICY "Users can view files in their workspace" ON intake_files
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert files in their workspace" ON intake_files
    FOR INSERT WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can update files in their workspace" ON intake_files
    FOR UPDATE USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete files in their workspace" ON intake_files
    FOR DELETE USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Comments
CREATE POLICY "Users can view comments in their workspace" ON section_comments
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert comments in their workspace" ON section_comments
    FOR INSERT WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- Logs
CREATE POLICY "Users can view logs in their workspace" ON activity_logs
    FOR SELECT USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert logs in their workspace" ON activity_logs
    FOR INSERT WITH CHECK (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
