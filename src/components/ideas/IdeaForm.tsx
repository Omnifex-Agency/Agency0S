"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ideaSchema, IdeaFormValues } from "@/lib/validations/idea"
import { useCreateIdea } from "@/hooks/useIdeas"
import { toast } from "@/hooks/use-toast"

interface IdeaFormProps {
    onSuccess?: () => void
}

export function IdeaForm({ onSuccess }: IdeaFormProps) {
    const createIdea = useCreateIdea()

    const form = useForm<IdeaFormValues>({
        resolver: zodResolver(ideaSchema),
        defaultValues: {
            title: "",
            status: "new",
            template_type: "generic",
            problem: "",
            insight: "",
            hypothesis: "",
        },
    })

    async function onSubmit(data: IdeaFormValues) {
        try {
            await createIdea.mutateAsync(data)
            toast({
                title: "Idea Created",
                description: "Your idea has been captured.",
            })
            form.reset()
            onSuccess?.()
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong.",
                variant: "destructive",
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Viral Campaign for X" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="template_type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="generic">Generic</SelectItem>
                                        <SelectItem value="campaign">Marketing Campaign</SelectItem>
                                        <SelectItem value="feature">Product Feature</SelectItem>
                                        <SelectItem value="process">Internal Process</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="validating">Validating</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="problem"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Problem</FormLabel>
                            <FormControl>
                                <Textarea placeholder="What problem are we solving?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="insight"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Insight (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="What unique insight do we have?" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={createIdea.isPending} className="w-full">
                    {createIdea.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Idea
                </Button>
            </form>
        </Form>
    )
}
