import * as z from "zod"

export const clientSchema = z.object({
    company_name: z.string().min(2, "Company name must be at least 2 characters"),
    website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    industry: z.string().optional(),
    status: z.enum(["active", "lead", "churned", "archived"]),
    health_score: z.number().min(0).max(100).optional(),
    tags: z.array(z.string()).optional(),
    // contacts field can be handled separately or here if we support nested creation
})

export type ClientFormValues = z.infer<typeof clientSchema>
