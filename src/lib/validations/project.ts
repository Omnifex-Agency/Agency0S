import * as z from "zod"

export const projectSchema = z.object({
    name: z.string().min(2, "Project name must be at least 2 characters"),
    description: z.string().optional(),
    client_id: z.string().uuid("Please select a client"),
    status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]),
    start_date: z.string().optional().or(z.literal("")),
    end_date: z.string().optional().or(z.literal("")),
    budget: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
