-- Create Research Docs Table
CREATE TABLE IF NOT EXISTS research_docs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT, -- Markdown content or JSON
    type TEXT NOT NULL DEFAULT 'general', -- 'general', 'competitor_analysis', 'swot', 'meeting_notes'
    
    -- Optional Links
    target_id UUID REFERENCES targets(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_research_workspace_id ON research_docs(workspace_id);
CREATE INDEX IF NOT EXISTS idx_research_target_id ON research_docs(target_id);
CREATE INDEX IF NOT EXISTS idx_research_client_id ON research_docs(client_id);

-- Enable RLS
ALTER TABLE research_docs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view research_docs in their workspace" ON research_docs
    FOR SELECT USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert research_docs in their workspace" ON research_docs
    FOR INSERT WITH CHECK (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update research_docs in their workspace" ON research_docs
    FOR UPDATE USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete research_docs in their workspace" ON research_docs
    FOR DELETE USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));
