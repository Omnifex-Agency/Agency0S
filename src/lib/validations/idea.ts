import * as z from "zod"

export const ideaSchema = z.object({
    title: z.string().min(2, "Title is required"),
    status: z.enum([
        "new", "validating", "refined", "approved", "turned_into_project", "parked", "rejected"
    ]),
    template_type: z.string(),

    // Structured fields
    problem: z.string().optional(),
    insight: z.string().optional(),
    hypothesis: z.string().optional(),

    // Execution
    execution_plan: z.string().optional(),
    metrics: z.string().optional(),
    risks: z.string().optional(),
    next_steps: z.string().optional(),

    tags: z.array(z.string()).optional(),
})

export type IdeaFormValues = z.infer<typeof ideaSchema>
