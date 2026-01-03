export const MOCK_CLIENTS = [
    {
        id: "c1",
        workspace_id: "demo-ws",
        company_name: "Acme Corp",
        website: "https://acme.com",
        primary_contact_name: "John Doe",
        primary_contact_email: "john@acme.com",
        primary_contact_role: "CEO",
        stage: "onboarding",
        onboarding_status: "incomplete",
        priority: "high",
        owner_id: "u1",
        start_date: "2026-01-10",
        target_date: "2026-02-15",
        last_followup_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        intake_notes: "Waiting on legal team approval for the branding assets.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "c2",
        workspace_id: "demo-ws",
        company_name: "Stellar Innovations",
        website: "https://stellar.io",
        primary_contact_name: "Sarah Smith",
        primary_contact_email: "sarah@stellar.io",
        primary_contact_role: "Product Lead",
        stage: "lead",
        onboarding_status: "not_started",
        priority: "medium",
        owner_id: "u1",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "c3",
        workspace_id: "demo-ws",
        company_name: "Oceanic Airlines",
        website: "https://oceanic.com",
        primary_contact_name: "Jack Shephard",
        primary_contact_email: "jack@oceanic.com",
        primary_contact_role: "Director",
        stage: "in_progress",
        onboarding_status: "approved",
        priority: "high",
        owner_id: "u1",
        start_date: "2025-12-01",
        target_date: "2026-03-01",
        last_followup_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        intake_notes: "All clear. Project moving smoothly.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
]

export const MOCK_SESSIONS = {
    "c1": {
        session: {
            id: "s1",
            client_id: "c1",
            status: "incomplete",
            completion_percentage: 40,
            created_at: new Date().toISOString(),
        },
        sections: [
            {
                section_key: "basic_info",
                status: "done",
                data: {
                    contact_name: "John Doe",
                    timezone: "EST (UTC-5)",
                    phone: "+1 555 0199"
                }
            },
            {
                section_key: "requirements",
                status: "waiting",
                data: {
                    project_goal: "Revamp the main marketing site to improve conversion by 20%.",
                    deadline: "2026-03-01"
                }
            },
            {
                section_key: "assets",
                status: "draft",
                data: {}
            },
            {
                section_key: "access",
                status: "changes_requested",
                data: {
                    access_notes: "Credentials sent via email (unsafe)."
                }
            },
            {
                section_key: "billing",
                status: "done",
                data: {
                    package_plan: "Enterprise Scale",
                    payment_status: "deposit_paid"
                }
            }
        ]
    },
    // c2 has no started session yet
    "c2": {
        session: {
            id: "s2",
            client_id: "c2",
            status: "not_started",
            completion_percentage: 0,
            created_at: new Date().toISOString(),
        },
        sections: [
            { section_key: "basic_info", status: "draft", data: {} },
            { section_key: "requirements", status: "draft", data: {} },
            { section_key: "assets", status: "draft", data: {} },
            { section_key: "access", status: "draft", data: {} },
            { section_key: "billing", status: "draft", data: {} }
        ]
    },
    "c3": {
        session: {
            id: "s3",
            client_id: "c3",
            status: "approved",
            completion_percentage: 100,
            created_at: new Date().toISOString(),
        },
        sections: [
            { section_key: "basic_info", status: "done", data: {} },
            { section_key: "requirements", status: "done", data: {} },
            { section_key: "assets", status: "done", data: {} },
            { section_key: "access", status: "done", data: {} },
            { section_key: "billing", status: "done", data: {} }
        ]
    }
}
