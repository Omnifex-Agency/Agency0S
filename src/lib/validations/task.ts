import * as z from "zod"

export const taskSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    status: z.enum(["todo", "in_progress", "review", "done", "cancelled"]),
    priority: z.enum(["low", "medium", "high", "urgent"]),
    due_date: z.string().optional().or(z.literal("")), // Date string YYYY-MM-DD
    assignee_id: z.string().uuid().optional().or(z.literal("")),
    client_id: z.string().uuid().optional().or(z.literal("")),
    project_id: z.string().uuid().optional().or(z.literal("")),
    tags: z.array(z.string()).optional(),
})

export type TaskFormValues = z.infer<typeof taskSchema>
