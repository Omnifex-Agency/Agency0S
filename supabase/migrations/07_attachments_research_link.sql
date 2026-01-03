-- Add research_doc_id to attachments table
ALTER TABLE attachments 
ADD COLUMN IF NOT EXISTS research_doc_id UUID REFERENCES research_docs(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_attachments_research_doc_id ON attachments(research_doc_id);
