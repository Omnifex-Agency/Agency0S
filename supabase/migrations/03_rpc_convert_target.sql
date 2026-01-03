CREATE OR REPLACE FUNCTION convert_target_to_client(
    p_target_id UUID,
    p_workspace_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- needed to access other tables if RLS requires it, or to use auth.uid() reliably in some contexts
AS $$
DECLARE
    v_target RECORD;
    v_client_id UUID;
    v_lead_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    -- 1. Fetch Target
    SELECT * INTO v_target FROM targets 
    WHERE id = p_target_id AND workspace_id = p_workspace_id;

    IF v_target IS NULL THEN
        RAISE EXCEPTION 'Target not found or access denied';
    END IF;

    -- 2. Create Client
    INSERT INTO clients (workspace_id, company_name, website, industry, status)
    VALUES (p_workspace_id, v_target.company_name, v_target.website, v_target.industry, 'active')
    RETURNING id INTO v_client_id;

    -- 3. Create Contact (if primary contact exists)
    IF v_target.primary_contact_name IS NOT NULL AND v_target.primary_contact_name <> '' THEN
        INSERT INTO contacts (client_id, full_name, email, job_title, is_primary)
        VALUES (v_client_id, v_target.primary_contact_name, v_target.primary_contact_email, v_target.primary_contact_role, true);
    END IF;

    -- 4. Create Lead
    INSERT INTO leads (workspace_id, client_id, title, stage, description)
    VALUES (
        p_workspace_id, 
        v_client_id, 
        'New Deal: ' || v_target.company_name, 
        'new', 
        'Converted from Target list'
    )
    RETURNING id INTO v_lead_id;

    -- 5. Update Target Status to 'converted'
    UPDATE targets 
    SET status = 'converted'
    WHERE id = p_target_id;

    -- 6. Log Activity
    INSERT INTO activity_log (
        workspace_id, 
        user_id,
        action, 
        entity_type, 
        entity_id, 
        entity_name, 
        client_id, 
        metadata
    )
    VALUES (
        p_workspace_id,
        v_user_id,
        'converted',
        'target',
        p_target_id,
        v_target.company_name,
        v_client_id,
        jsonb_build_object('lead_id', v_lead_id, 'client_id', v_client_id)
    );

    -- 7. Return Data
    RETURN jsonb_build_object(
        'client_id', v_client_id,
        'lead_id', v_lead_id,
        'target_id', p_target_id
    );
END;
$$;
