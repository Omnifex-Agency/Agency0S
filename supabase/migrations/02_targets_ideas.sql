-- MODULE 1: TARGETS (Companies to approach)

CREATE TYPE target_status AS ENUM ('new', 'identifying', 'researching', 'ready_to_pitch', 'pitching', 'converted', 'discarded');

CREATE TABLE targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL, -- Assumes workspace isolation logic exists
    
    -- Core Info
    company_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    industry VARCHAR(100),
    
    -- Status pipeline
    status target_status DEFAULT 'new',
    
    -- Contact Logic
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_role VARCHAR(100),
    
    -- Metadata
    tags TEXT[],
    confidence_score INTEGER DEFAULT 0, -- 0-100
    
    -- Timestamps
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Target Research (Specific research documents per target)
CREATE TABLE target_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    target_id UUID REFERENCES targets(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL, -- 'website_audit', 'competitor', 'tech_stack', 'seo', 'financial', 'hiring'
    title VARCHAR(255) NOT NULL,
    content JSONB DEFAULT '{}', -- Structured content based on template
    
    created_by_id UUID REFERENCES users(id), -- Assuming users table exists
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MODULE 2: IDEAS (Brainstorming Hub)

CREATE TYPE idea_status AS ENUM ('new', 'validating', 'refined', 'approved', 'turned_into_project', 'parked', 'rejected');

CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL,
    
    -- Core Fields
    title VARCHAR(255) NOT NULL,
    status idea_status DEFAULT 'new',
    
    -- Structured Thinking
    problem TEXT,
    insight TEXT,
    hypothesis TEXT,
    
    -- Execution
    execution_plan TEXT, -- Can be bullet points
    metrics TEXT,
    risks TEXT,
    next_steps TEXT,
    
    -- Template Type
    template_type VARCHAR(50) DEFAULT 'generic', -- 'campaign', 'website', 'pitch', 'experiment'
    
    -- Meta
    assets JSONB DEFAULT '[]', -- Array of links or file references
    tags TEXT[],
    
    -- Relationships (Polymorphic-ish or specific columns)
    related_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    related_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Assuming 'workspaces' table logic typically checks auth.uid() against workspace_members)
-- For simplicity in this SQL, checks are basic. In production, replicate your existing RLS patterns.

ALTER TABLE targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Targets Policies
CREATE POLICY "Users can view targets in their workspace" ON targets
    FOR SELECT USING (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can insert targets in their workspace" ON targets
    FOR INSERT WITH CHECK (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can update targets in their workspace" ON targets
    FOR UPDATE USING (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can delete targets in their workspace" ON targets
    FOR DELETE USING (workspace_id::text = current_setting('app.current_workspace_id', true));

-- Research Policies
CREATE POLICY "Users can view research" ON target_research
    FOR SELECT USING (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can insert research" ON target_research
    FOR INSERT WITH CHECK (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can update research" ON target_research
    FOR UPDATE USING (workspace_id::text = current_setting('app.current_workspace_id', true));

-- Ideas Policies
CREATE POLICY "Users can view ideas" ON ideas
    FOR SELECT USING (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can insert ideas" ON ideas
    FOR INSERT WITH CHECK (workspace_id::text = current_setting('app.current_workspace_id', true));

CREATE POLICY "Users can update ideas" ON ideas
    FOR UPDATE USING (workspace_id::text = current_setting('app.current_workspace_id', true));

-- Indexes
CREATE INDEX idx_targets_workspace ON targets(workspace_id);
CREATE INDEX idx_targets_status ON targets(status);
CREATE INDEX idx_target_research_target ON target_research(target_id);
CREATE INDEX idx_ideas_workspace ON ideas(workspace_id);
CREATE INDEX idx_ideas_status ON ideas(status);

-- Trigger for Updated At
CREATE TRIGGER update_targets_updated_at BEFORE UPDATE ON targets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_target_research_updated_at BEFORE UPDATE ON target_research FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
