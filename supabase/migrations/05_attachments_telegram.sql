-- Create Attachments Table with Telegram support
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- File Info
    file_name TEXT NOT NULL,
    file_extension TEXT,
    mime_type TEXT,
    size_bytes BIGINT,
    
    -- Storage Provider
    storage_provider TEXT NOT NULL DEFAULT 'supabase', -- 'supabase', 'telegram', 'link'
    storage_path TEXT, -- for supabase buckets
    telegram_file_id TEXT, -- for telegram
    telegram_message_id BIGINT, -- for telegram
    
    -- Entity Associations (Polymorphic-style via nullable columns)
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attachments_workspace_id ON attachments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_attachments_target_id ON attachments(target_id);
CREATE INDEX IF NOT EXISTS idx_attachments_client_id ON attachments(client_id);
CREATE INDEX IF NOT EXISTS idx_attachments_created_at ON attachments(created_at DESC);

-- Enable RLS
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view attachments in their workspace" ON attachments
    FOR SELECT USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert attachments in their workspace" ON attachments
    FOR INSERT WITH CHECK (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete attachments in their workspace" ON attachments
    FOR DELETE USING (workspace_id IN (
        SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    ));
