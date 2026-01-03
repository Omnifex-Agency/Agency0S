export const DUMMY_DATA_BACKUP = {
    "state": {
        "meta": { "schema_version": 1, "updated_at": new Date().toISOString() },
        "ideas": {
            "i1": {
                "id": "i1",
                "created_at": "2026-01-01T10:00:00Z",
                "updated_at": "2026-01-01T12:00:00Z",
                "title": "AgencyOS: Client Portal",
                "one_liner": "A dedicated portal for clients to view project status and approve assets.",
                "description": "Clients currently email us for updates. This portal solves the communication gap by giving them a real-time dashboard.",
                "stage": "exploring",
                "tags": ["client-experience", "saas", "portal"],
                "owner_id": "u1",
                "canvas": {
                    "problem": "Clients send 10+ emails per week asking for status updates.",
                    "user": "Agency Clients (Marketing Directors).",
                    "value_prop": "Reduce email volume by 50% and increase transparency.",
                    "differentiation": "Most portals are read-only; ours allows direct approval and commenting.",
                    "assumptions": ["Clients will actually log in.", "Security compliance is manageable."],
                    "risks": ["Adoption friction.", "Data privacy concerns."],
                    "mvp_scope": ["Dashboard", "Asset list", "Approve button"],
                    "success_metrics": ["50% login rate in week 1"]
                },
                "scores": {
                    "ice": { "impact": 8, "confidence": 7, "ease": 6, "total": 336 },
                    "rice": { "reach": 50, "impact": 2, "confidence": 80, "effort": 2, "total": 4000 }
                },
                "link_ids": { "research": ["r1", "r2"], "experiments": [], "decisions": ["d1"], "execution_cards": [] }
            },
            "i2": {
                "id": "i2",
                "created_at": "2026-01-02T09:00:00Z",
                "updated_at": "2026-01-02T09:00:00Z",
                "title": "AI Content Generator",
                "one_liner": "Auto-generate social media posts from blog content.",
                "description": "Leverage GPT-4 to repurpose long-form content.",
                "stage": "inbox",
                "tags": ["ai", "growth"],
                "owner_id": "u1",
                "canvas": {
                    "problem": "", "user": "", "value_prop": "", "differentiation": "",
                    "assumptions": [], "risks": [], "mvp_scope": [], "success_metrics": []
                },
                "scores": {
                    "ice": { "impact": 5, "confidence": 5, "ease": 5, "total": 125 },
                    "rice": { "reach": 1000, "impact": 1, "confidence": 80, "effort": 4, "total": 200 }
                },
                "link_ids": { "research": [], "experiments": [], "decisions": [], "execution_cards": [] }
            },
            "i3": {
                "id": "i3",
                "created_at": "2026-01-01T14:00:00Z",
                "updated_at": "2026-01-01T15:00:00Z",
                "title": "Internal Knowledge Base",
                "one_liner": "Notion-style wiki for internal docs.",
                "description": "",
                "stage": "building",
                "tags": ["internal"],
                "owner_id": "u1",
                "canvas": {
                    "problem": "", "user": "", "value_prop": "", "differentiation": "",
                    "assumptions": [], "risks": [], "mvp_scope": [], "success_metrics": []
                },
                "scores": {
                    "ice": { "impact": 5, "confidence": 5, "ease": 5, "total": 125 },
                    "rice": { "reach": 10, "impact": 0.5, "confidence": 100, "effort": 1, "total": 500 }
                },
                "link_ids": { "research": [], "experiments": [], "decisions": ["d2"], "execution_cards": [] }
            },
            "i4": {
                "id": "i4",
                "created_at": "2025-12-20T14:00:00Z",
                "updated_at": "2025-12-25T15:00:00Z",
                "title": "Mobile App V2",
                "one_liner": "Complete redesign of the mobile experience.",
                "description": "",
                "stage": "archived",
                "tags": ["mobile", "v2"],
                "owner_id": "u1",
                "canvas": {
                    "problem": "", "user": "", "value_prop": "", "differentiation": "",
                    "assumptions": [], "risks": [], "mvp_scope": [], "success_metrics": []
                },
                "scores": {
                    "ice": { "impact": 5, "confidence": 5, "ease": 2, "total": 50 },
                    "rice": { "reach": 5000, "impact": 3, "confidence": 50, "effort": 12, "total": 625 }
                },
                "link_ids": { "research": [], "experiments": [], "decisions": ["d3"], "execution_cards": [] }
            }
        },
        "sessions": {
            "s1": {
                "id": "s1",
                "created_at": "2026-01-02T10:00:00Z",
                "updated_at": "2026-01-02T10:30:00Z",
                "topic": "Q1 Marketing Campaigns",
                "method": "crazy8s",
                "status": "active",
                "participants": ["u1", "u2"],
                "config": { "timer_minutes": 8, "prompts": [], "voting_enabled": true }
            },
            "s2": {
                "id": "s2",
                "created_at": "2025-12-15T10:00:00Z",
                "updated_at": "2025-12-15T11:00:00Z",
                "topic": "Retention Features",
                "method": "free",
                "status": "completed",
                "participants": ["u1"],
                "config": { "timer_minutes": 20, "prompts": [], "voting_enabled": true }
            }
        },
        "notes": {
            "n1": {
                "id": "n1", "session_id": "s1", "content": "Viral TikTok Challenge", "author_id": "u1",
                "color": "yellow", "votes": 3, "created_at": "2026-01-02T10:05:00Z", "updated_at": "2026-01-02T10:05:00Z", "x": 0, "y": 0
            },
            "n2": {
                "id": "n2", "session_id": "s1", "content": "Influencer Partnerships", "author_id": "u1",
                "color": "blue", "votes": 5, "created_at": "2026-01-02T10:06:00Z", "updated_at": "2026-01-02T10:06:00Z", "x": 0, "y": 0
            },
            "n3": {
                "id": "n3", "session_id": "s1", "content": "Email Drip Campaign", "author_id": "u2",
                "color": "pink", "votes": 1, "created_at": "2026-01-02T10:07:00Z", "updated_at": "2026-01-02T10:07:00Z", "x": 0, "y": 0
            }
        },
        "research": {
            "r1": {
                "id": "r1", "type": "competitor_analysis", "title": "Competitor X Portal Review",
                "url": "https://example.com/competitor-portal",
                "summary": "They offer file sharing but no approval workflow.",
                "why_it_matters": "We can win on workflow efficiency.",
                "key_insights": ["Users hate the login flow."],
                "reliability_score": 4,
                "tags": ["competitor"],
                "created_at": "2026-01-01T11:00:00Z", "updated_at": "2026-01-01T11:00:00Z"
            },
            "r2": {
                "id": "r2", "type": "user_feedback", "title": "Client Interview: Sarah @ TechCo",
                "summary": "Sarah mentioned she spends 2h/week just searching for files in email threads.",
                "why_it_matters": "Validates the 'Central Repository' value prop.",
                "key_insights": ["Email is the enemy."],
                "reliability_score": 5,
                "tags": ["interview"],
                "created_at": "2026-01-01T11:30:00Z", "updated_at": "2026-01-01T11:30:00Z"
            }
        },
        "decisions": {
            "d1": {
                "id": "d1", "idea_id": "i1", "outcome": "needs_data",
                "rationale": "Concept is strong, but we need to confirm security requirements before building.",
                "participants": ["u1", "security-team"], "reversible": true,
                "created_at": "2026-01-01T16:00:00Z", "updated_at": "2026-01-01T16:00:00Z",
                "snapshot": { "stage": "exploring", "rice_score": 4000 }
            },
            "d2": {
                "id": "d2", "idea_id": "i3", "outcome": "approved",
                "rationale": "Internal productivity is blocked. Low effort to implement.",
                "participants": ["u1"], "reversible": true,
                "created_at": "2026-01-01T17:00:00Z", "updated_at": "2026-01-01T17:00:00Z",
                "snapshot": { "stage": "exploring", "rice_score": 500 }
            },
            "d3": {
                "id": "d3", "idea_id": "i4", "outcome": "rejected",
                "rationale": "Too expensive for current budget constraints. Revisit in Q4.",
                "participants": ["board"], "reversible": false,
                "created_at": "2025-12-25T10:00:00Z", "updated_at": "2025-12-25T10:00:00Z",
                "snapshot": { "stage": "validated", "rice_score": 625 }
            }
        }
    },
    "events": []
}
