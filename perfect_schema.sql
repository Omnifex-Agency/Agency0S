/*
  AGENCY OS - PERFECT SCHEMA (PostgreSQL / Supabase)
  Generated Code for "Agency0S"
  
  -- INSTRUCTIONS:
  -- 1. Run this entire script in your Supabase SQL Editor.
  -- 2. It will create all tables, indexes, RLS policies, and triggers.
  -- 3. Ensure you have the 'uuid-ossp' extension enabled.
*/

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Common Functions
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 3. Tables & Schemas

-- [workspaces]
create table if not exists public.workspaces (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text not null unique,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [workspace_members]
create table if not exists public.workspace_members (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    role text check (role in ('owner', 'admin', 'member')) default 'member',
    created_at timestamp with time zone default now(),
    unique(workspace_id, user_id)
);

-- Helper function to check workspace access for RLS
create or replace function public.is_workspace_member(_workspace_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.workspace_members
    where workspace_id = _workspace_id
    and user_id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- [clients]
create table if not exists public.clients (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    company_name text not null,
    website text,
    industry text,
    status text default 'active',
    health_score numeric default 100,
    owner_id uuid references auth.users(id),
    tags text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [contacts]
create table if not exists public.contacts (
    id uuid default uuid_generate_v4() primary key,
    client_id uuid references public.clients(id) on delete cascade not null,
    full_name text not null,
    email text,
    phone text,
    job_title text,
    is_primary boolean default false,
    created_at timestamp with time zone default now()
);

-- [leads]
create table if not exists public.leads (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete set null,
    title text not null,
    description text,
    stage text default 'new',
    estimated_value numeric,
    probability numeric,
    expected_close_date timestamp with time zone,
    next_action text,
    last_contacted_at timestamp with time zone,
    owner_id uuid references auth.users(id),
    tags text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [projects]
create table if not exists public.projects (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    name text not null,
    description text,
    status text default 'planning',
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    budget numeric,
    owner_id uuid references auth.users(id),
    tags text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [tasks]
create table if not exists public.tasks (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    title text not null,
    description text,
    status text default 'todo',
    priority text default 'medium',
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    assignee_id uuid references auth.users(id),
    client_id uuid references public.clients(id) on delete set null,
    lead_id uuid references public.leads(id) on delete set null,
    project_id uuid references public.projects(id) on delete set null,
    research_id uuid, -- loose ref to research
    tags text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [research]
create table if not exists public.research (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete set null,
    target_id uuid, -- loose ref to targets
    project_id uuid references public.projects(id) on delete set null,
    title text not null,
    type text default 'general',
    status text default 'draft',
    content jsonb, -- rich text or structured content
    owner_id uuid references auth.users(id),
    tags text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [targets]
create table if not exists public.targets (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    company_name text not null,
    website text,
    industry text,
    status text default 'new', -- new, identifying, researching, ready_to_pitch, pitching, converted, discarded
    primary_contact_name text,
    primary_contact_email text,
    primary_contact_role text,
    tags text[],
    confidence_score numeric,
    last_contacted_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [target_research] (Specific deeply nested research for targets)
create table if not exists public.target_research (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    target_id uuid references public.targets(id) on delete cascade not null,
    type text not null,
    title text not null,
    content jsonb,
    created_by_id uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [ideas] (Also used for Credentials via template_type='credential')
create table if not exists public.ideas (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    title text not null,
    status text default 'new',
    template_type text default 'basic', -- credential, feature, experiment
    
    -- Specific fields for Idea Storming
    problem text,
    insight text,
    hypothesis text,
    execution_plan text,
    metrics text,
    risks text,
    next_steps text,
    
    assets jsonb, -- Flexible storage (credentials here)
    tags text[],
    
    related_client_id uuid references public.clients(id) on delete set null,
    related_project_id uuid references public.projects(id) on delete set null,
    owner_id uuid references auth.users(id),
    
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [notes]
create table if not exists public.notes (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete set null,
    lead_id uuid references public.leads(id) on delete set null,
    title text not null,
    content text,
    note_type text default 'general',
    meeting_date timestamp with time zone,
    created_by_id uuid references auth.users(id),
    tags text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [attachments]
create table if not exists public.attachments (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    uploaded_by uuid references auth.users(id),
    file_name text not null,
    file_extension text,
    mime_type text not null,
    size_bytes bigint not null,
    storage_provider text not null, -- 'telegram', 's3', etc.
    telegram_file_id text,
    telegram_message_id text,
    
    -- Polytechnic References
    target_id uuid references public.targets(id) on delete set null,
    client_id uuid references public.clients(id) on delete set null,
    task_id uuid references public.tasks(id) on delete set null,
    project_id uuid references public.projects(id) on delete set null,
    research_doc_id uuid references public.research(id) on delete set null,
    
    created_at timestamp with time zone default now()
);

-- [activity_log]
create table if not exists public.activity_log (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    user_id uuid references auth.users(id),
    user_name text,
    action text not null, -- created, updated, deleted, status_changed
    entity_type text not null, -- client, project, task
    entity_id text not null,
    entity_name text,
    client_id text, -- optional denormalized for easier filtering
    changes jsonb,
    metadata jsonb,
    created_at timestamp with time zone default now()
);

-- [onboarding_sessions]
create table if not exists public.onboarding_sessions (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    template_key text,
    status text default 'not_started',
    completion_percentage numeric default 0,
    submitted_at timestamp with time zone,
    approved_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [onboarding_sections]
create table if not exists public.onboarding_sections (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    session_id uuid references public.onboarding_sessions(id) on delete cascade not null,
    section_key text not null,
    status text default 'draft',
    data jsonb,
    assigned_to uuid, -- email or loose ref
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- [intake_files]
create table if not exists public.intake_files (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    client_id uuid references public.clients(id) on delete cascade not null,
    session_id uuid references public.onboarding_sessions(id) on delete set null,
    section_id uuid references public.onboarding_sections(id) on delete set null,
    file_key text not null,
    kind text not null,
    url text not null,
    filename text,
    mime_type text,
    size_bytes bigint,
    created_at timestamp with time zone default now()
);

-- [section_comments]
create table if not exists public.section_comments (
    id uuid default uuid_generate_v4() primary key,
    workspace_id uuid references public.workspaces(id) on delete cascade not null,
    section_id uuid references public.onboarding_sections(id) on delete cascade not null,
    user_id uuid references auth.users(id),
    content text not null,
    created_at timestamp with time zone default now()
);


-- 4. Enable Row Level Security (RLS) on ALL tables
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.clients enable row level security;
alter table public.contacts enable row level security;
alter table public.leads enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.research enable row level security;
alter table public.targets enable row level security;
alter table public.target_research enable row level security;
alter table public.ideas enable row level security;
alter table public.notes enable row level security;
alter table public.attachments enable row level security;
alter table public.activity_log enable row level security;
alter table public.onboarding_sessions enable row level security;
alter table public.onboarding_sections enable row level security;
alter table public.intake_files enable row level security;
alter table public.section_comments enable row level security;

-- 5. RLS Policies
-- General Rule: Users can CRUD if they are a member of the workspace_id.

-- Workspaces: Visible if you are a member
create policy "Workspaces visible to members"
    on public.workspaces for select
    using ( exists (
        select 1 from public.workspace_members
        where workspace_id = workspaces.id
        and user_id = auth.uid()
    ));

create policy "Workspace members visible to self"
    on public.workspace_members for select
    using (
        user_id = auth.uid() or 
        workspace_id in (
            select workspace_id from public.workspace_members where user_id = auth.uid()
        )
    );

-- Macro for standard tenancy policy
-- NOTE: In Supabase SQL editor, you have to create these individually.

-- Clients
create policy "Clients accessible by workspace members"
    on public.clients for all
    using ( is_workspace_member(workspace_id) );

-- Contacts
create policy "Contacts accessible via client workspace"
    on public.contacts for all
    using ( exists (
        select 1 from public.clients
        where clients.id = contacts.client_id
        and is_workspace_member(clients.workspace_id)
    ));

-- Leads
create policy "Leads accessible by workspace members"
    on public.leads for all
    using ( is_workspace_member(workspace_id) );

-- Projects
create policy "Projects accessible by workspace members"
    on public.projects for all
    using ( is_workspace_member(workspace_id) );

-- Tasks
create policy "Tasks accessible by workspace members"
    on public.tasks for all
    using ( is_workspace_member(workspace_id) );

-- Research
create policy "Research accessible by workspace members"
    on public.research for all
    using ( is_workspace_member(workspace_id) );

-- Targets
create policy "Targets accessible by workspace members"
    on public.targets for all
    using ( is_workspace_member(workspace_id) );

-- Target Research
create policy "Target Research accessible by workspace members"
    on public.target_research for all
    using ( is_workspace_member(workspace_id) );

-- Ideas (Credentials)
create policy "Ideas accessible by workspace members"
    on public.ideas for all
    using ( is_workspace_member(workspace_id) );

-- Notes
create policy "Notes accessible by workspace members"
    on public.notes for all
    using ( is_workspace_member(workspace_id) );

-- Attachments
create policy "Attachments accessible by workspace members"
    on public.attachments for all
    using ( is_workspace_member(workspace_id) );

-- Activity Log
create policy "Activity Log visible to workspace members"
    on public.activity_log for select
    using ( is_workspace_member(workspace_id) );

-- Onboarding
create policy "Onboarding accessible by workspace members"
    on public.onboarding_sessions for all
    using ( is_workspace_member(workspace_id) );

create policy "Sections accessible by workspace members"
    on public.onboarding_sections for all
    using ( is_workspace_member(workspace_id) );

create policy "Intake files accessible by workspace members"
    on public.intake_files for all
    using ( is_workspace_member(workspace_id) );

create policy "Comments accessible by workspace members"
    on public.section_comments for all
    using ( is_workspace_member(workspace_id) );


-- 6. Triggers for updated_at
create trigger handle_updated_at before update on public.workspaces
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.clients
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.leads
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.projects
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.tasks
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.research
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.targets
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.target_research
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.ideas
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.notes
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.onboarding_sessions
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.onboarding_sections
    for each row execute procedure public.handle_updated_at();


-- 7. Special Functions
create or replace function public.convert_target_to_client(
    p_target_id uuid,
    p_workspace_id uuid
)
returns uuid
language plpgsql security definer
as $$
declare
    v_target RECORD;
    v_new_client_id uuid;
begin
    -- 1. Get Target Data
    select * into v_target from public.targets
    where id = p_target_id and workspace_id = p_workspace_id;

    if not found then
        raise exception 'Target not found';
    end if;

    -- 2. Create Client
    insert into public.clients (
        workspace_id,
        company_name,
        website,
        industry,
        status,
        health_score,
        tags
    ) values (
        p_workspace_id,
        v_target.company_name,
        v_target.website,
        v_target.industry,
        'active',
        100,
        v_target.tags
    )
    returning id into v_new_client_id;

    -- 3. Create Primary Contact if exists
    if v_target.primary_contact_name is not null then
        insert into public.contacts (
            client_id,
            full_name,
            email,
            job_title,
            is_primary
        ) values (
            v_new_client_id,
            v_target.primary_contact_name,
            v_target.primary_contact_email,
            v_target.primary_contact_role,
            true
        );
    end if;

    -- 4. Update Target Status
    update public.targets
    set status = 'converted'
    where id = p_target_id;

    return v_new_client_id;
end;
$$;
