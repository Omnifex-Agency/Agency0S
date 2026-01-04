import * as z from "zod"

export const targetSchema = z.object({
    company_name: z.string().min(2, "Company name is required"),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    industry: z.string().optional(),
    status: z.enum([
        "new", "identifying", "researching", "ready_to_pitch", "pitching", "converted", "discarded"
    ]),
    primary_contact_name: z.string().optional(),
    primary_contact_email: z.string().email("Invalid email").optional().or(z.literal("")),
    primary_contact_role: z.string().optional(),
    confidence_score: z.number().min(0).max(100),
    tags: z.array(z.string()).optional(),
})

export type TargetFormValues = z.infer<typeof targetSchema>
