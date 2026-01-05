/*
  SEED DATA SCRIPT FOR AGENCY OS
  ------------------------------------------------------------------
  Instructions:
  1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/[YOUR_PROJECT_REF]/sql
  2. Click "New Query".
  3. Copy and paste ALL the content below into the query window.
  4. Click "Run".
  
  What this does:
  - Finds the user 'testclient@agency.os' (created via Quick Setup).
  - Creates a Workspace "Agency Alpha" if it doesn't exist.
  - Adds Targets, Clients, Leads, Projects, and Tasks linked together.
  - Populates the Activity Log for the dashboard.
*/

DO $$
DECLARE
    v_user_id uuid;
    v_workspace_id uuid;
    v_client_tech_id uuid;
    v_client_retail_id uuid;
    v_project_id uuid;
    v_target_id uuid;
BEGIN
    -- 1. Get the User ID for testclient@agency.os
    -- If this fails, make sure you ran "Quick Setup" on the login page first!
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'testclient@agency.os';
    
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'User testclient@agency.os not found. Please sign up or run Quick Setup first.';
        RETURN;
    END IF;

    -- 2. Create or Get Workspace
    INSERT INTO public.workspaces (name, slug)
    VALUES ('Agency Alpha', 'agency-alpha')
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_workspace_id;

    -- 3. Add User to Workspace (if not already)
    INSERT INTO public.workspace_members (workspace_id, user_id, role)
    VALUES (v_workspace_id, v_user_id, 'owner')
    ON CONFLICT (workspace_id, user_id) DO NOTHING;

    -- 4. Create TARGETS (Pre-sales)
    INSERT INTO public.targets (workspace_id, company_name, website, industry, status, confidence_score, primary_contact_name, primary_contact_role)
    VALUES 
    (v_workspace_id, 'Nebula Startups', 'nebula.io', 'Technology', 'researching', 85, 'Alex Rivera', 'CTO'),
    (v_workspace_id, 'GreenLeaf Organics', 'greenleaf.com', 'Retail', 'ready_to_pitch', 92, 'Sarah Chen', 'Marketing Director'),
    (v_workspace_id, 'Quantum Finance', 'quantum.fi', 'Finance', 'new', 40, 'Marcus Cobb', 'VP of Ops')
    RETURNING id INTO v_target_id; -- Keep last one for reference if needed

    -- 5. Create CLIENTS
    INSERT INTO public.clients (workspace_id, company_name, website, industry, status, health_score, owner_id)
    VALUES 
    (v_workspace_id, 'TechFlow Systems', 'techflow.net', 'SaaS', 'active', 98, v_user_id)
    RETURNING id INTO v_client_tech_id;

    INSERT INTO public.clients (workspace_id, company_name, website, industry, status, health_score, owner_id)
    VALUES 
    (v_workspace_id, 'Moda Retail', 'modastyle.com', 'E-commerce', 'active', 75, v_user_id)
    RETURNING id INTO v_client_retail_id;

    -- 6. Create PROJECTS (Linked to Clients)
    INSERT INTO public.projects (workspace_id, client_id, name, description, status, budget, end_date)
    VALUES
    (v_workspace_id, v_client_tech_id, 'Q1 Marketing Overhaul', 'Complete rebrand and website refresh.', 'in_progress', 25000, now() + interval '45 days')
    RETURNING id INTO v_project_id;

    INSERT INTO public.projects (workspace_id, client_id, name, description, status, budget, end_date)
    VALUES
    (v_workspace_id, v_client_tech_id, 'Mobile App MVP', 'Flutter based mobile application.', 'planning', 45000, now() + interval '90 days');

    INSERT INTO public.projects (workspace_id, client_id, name, description, status, budget, end_date)
    VALUES
    (v_workspace_id, v_client_retail_id, 'SEO Campaign 2026', 'Backlink strategy and content writing.', 'active', 5000, now() + interval '10 days');

    -- 7. Create TASKS (Linked to Projects)
    INSERT INTO public.tasks (workspace_id, project_id, title, status, priority, due_date, assignee_id)
    VALUES
    (v_workspace_id, v_project_id, 'Design System Handiovwer', 'todo', 'high', now() + interval '2 days', v_user_id),
    (v_workspace_id, v_project_id, 'React Component Migration', 'in_progress', 'medium', now() + interval '5 days', v_user_id),
    (v_workspace_id, v_project_id, 'Client Feedback Session', 'todo', 'low', now() + interval '7 days', v_user_id);

    -- 8. Create LEADS (Pipeline)
    INSERT INTO public.leads (workspace_id, title, estimated_value, stage, probability, expected_close_date)
    VALUES
    (v_workspace_id, 'Enterprise License - CorpCorp', 120000, 'negotiation', 80, now() + interval '14 days'),
    (v_workspace_id, 'Consulting Retainer - StartUp Inc', 5000, 'discovery', 30, now() + interval '30 days');

    -- 9. Populate ACTIVITY LOG (For Dashboard "Recent Activity")
    INSERT INTO public.activity_log (workspace_id, user_id, user_name, action, entity_type, entity_id, entity_name, created_at)
    VALUES
    (v_workspace_id, v_user_id, 'Test Client', 'created', 'client', v_client_tech_id::text, 'TechFlow Systems', now() - interval '2 hours'),
    (v_workspace_id, v_user_id, 'Test Client', 'updated', 'project', v_project_id::text, 'Q1 Marketing Overhaul', now() - interval '1 hour'),
    (v_workspace_id, v_user_id, 'Test Client', 'completed', 'task', uuid_generate_v4()::text, 'Initial Scoping Meeting', now() - interval '15 minutes'),
    (v_workspace_id, v_user_id, 'Test Client', 'created', 'target', uuid_generate_v4()::text, 'Nebula Startups', now() - interval '5 minutes');

    RAISE NOTICE 'Seeding complete for User ID: %', v_user_id;
END $$;
