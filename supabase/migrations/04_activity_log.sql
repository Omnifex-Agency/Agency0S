CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    
    -- Actor
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    
    -- Action
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    entity_name VARCHAR(255),
    
    -- Context
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Details
    changes JSONB,
    metadata JSONB DEFAULT '{}',
    
    -- Timestamp
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_workspace_id ON activity_log(workspace_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_log(created_at DESC);

-- RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activity log in their workspace" ON activity_log
    FOR SELECT USING (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can insert activity log in their workspace" ON activity_log
    FOR INSERT WITH CHECK (workspace_id::text = current_setting('app.current_workspace_id', true));
