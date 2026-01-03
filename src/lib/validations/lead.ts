import * as z from "zod"

export const leadSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    company: z.string().min(2, "Company name is required"),
    value: z.number().min(0, "Value must be positive"),
    stage: z.enum([
        "new",
        "contacted",
        "qualified",
        "proposal",
        "negotiation",
        "won",
        "lost"
    ]),
    probability: z.number().min(0).max(100),
    contact_id: z.string().uuid().optional().or(z.literal("")),
    notes: z.string().optional(),
})

export type LeadFormValues = z.infer<typeof leadSchema>
