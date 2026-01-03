# 🚀 Agency OS - Quick Start Guide

## ✅ What's Been Set Up

Your Next.js application is now properly initialized with:

✅ **Next.js 14** with App Router, TypeScript, and Tailwind CSS  
✅ **All dependencies installed** (Supabase, TanStack Query, React Hook Form, dnd-kit, etc.)  
✅ **Environment variables configured** (.env.local created)  
✅ **Database types** (src/types/database.ts)  
✅ **Supabase clients** (src/lib/supabase/client.ts & server.ts)  
✅ **Utility functions** (src/lib/utils.ts)  

## 📁 Current Structure

```
agency-os-app/
├── .env.local ✅ (with your Supabase credentials)
├── package.json ✅
├── tsconfig.json ✅
├── tailwind.config.ts ✅
├── next.config.ts ✅
└── src/
    ├── app/
    │   ├── layout.tsx (default Next.js)
    │   ├── page.tsx (default Next.js)
    │   └── globals.css (default Next.js)
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts ✅
    │   │   └── server.ts ✅
    │   └── utils.ts ✅
    └── types/
        └── database.ts ✅
```

## 🎯 Next Steps

### Step 1: Install shadcn/ui Components (5 minutes)

```bash
cd d:\projects\Notion\agency-os-app

# Initialize shadcn/ui
npx shadcn@latest init

# When prompted:
# - Would you like to use TypeScript? › Yes
# - Which style would you like to use? › New York
# - Which color would you like to use as base color? › Slate
# - Where is your global CSS file? › src/app/globals.css
# - Would you like to use CSS variables for colors? › Yes
# - Are you using a custom tailwind prefix? › No
# - Where is your tailwind.config.js located? › tailwind.config.ts
# - Configure the import alias for components? › @/components
# - Configure the import alias for utils? › @/lib/utils
# - Are you using React Server Components? › Yes

# Install required components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add skeleton
npx shadcn@latest add form
npx shadcn@latest add textarea
```

### Step 2: Update globals.css for Dark Theme

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Step 3: Create Root Layout with Dark Mode

Update `src/app/layout.tsx`:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agency OS",
  description: "Connected workspace for agencies",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Step 4: Test the Setup

```bash
npm run dev
```

Visit http://localhost:3000 - you should see the default Next.js page with dark theme.

## 📝 What to Build Next

Follow this order to build the application:

### Phase 1: Authentication (Days 1-2)

**Files to create:**
1. `src/app/(auth)/layout.tsx` - Auth layout
2. `src/app/(auth)/login/page.tsx` - Login page
3. `src/app/(auth)/signup/page.tsx` - Signup page
4. `src/components/auth/AuthForm.tsx` - Reusable auth form
5. `src/lib/auth.ts` - Auth helper functions

**Reference:** Check the parent folder's documentation for auth patterns.

### Phase 2: Dashboard Layout (Days 3-4)

**Files to create:**
1. `src/app/(dashboard)/layout.tsx` - Main dashboard layout
2. `src/components/layout/Sidebar.tsx` - Navigation sidebar
3. `src/components/layout/Topbar.tsx` - Top bar with workspace switcher
4. `src/components/layout/WorkspaceSwitcher.tsx` - Workspace dropdown
5. `src/components/layout/UserMenu.tsx` - User menu dropdown
6. `src/hooks/useWorkspace.tsx` - Workspace context hook

### Phase 3: Dashboard Page (Days 5-6)

**Files to create:**
1. `src/app/(dashboard)/page.tsx` - Dashboard page
2. `src/components/dashboard/KPICard.tsx` - KPI display card
3. `src/components/dashboard/MyTasks.tsx` - Tasks widget
4. `src/components/dashboard/HotLeads.tsx` - Hot leads widget
5. `src/components/dashboard/RecentActivity.tsx` - Activity timeline

### Phase 4: Clients Module (Days 7-10)

**Files to create:**
1. `src/app/(dashboard)/clients/page.tsx` - Clients list
2. `src/app/(dashboard)/clients/[id]/page.tsx` - Client detail
3. `src/components/clients/ClientList.tsx` - List component
4. `src/components/clients/ClientCard.tsx` - Card component
5. `src/components/clients/ClientForm.tsx` - Create/edit form
6. `src/components/clients/ClientDetail.tsx` - Detail view with tabs
7. `src/lib/validations/client.ts` - Zod validation schemas
8. `src/hooks/useClients.ts` - Data fetching hooks

### Phase 5: Pipeline Module (Days 11-13)

**Files to create:**
1. `src/app/(dashboard)/pipeline/page.tsx` - Pipeline kanban
2. `src/components/pipeline/PipelineBoard.tsx` - Kanban board
3. `src/components/pipeline/LeadCard.tsx` - Draggable lead card
4. `src/components/pipeline/LeadDrawer.tsx` - Lead details drawer
5. `src/components/pipeline/StageColumn.tsx` - Kanban column
6. `src/lib/validations/lead.ts` - Validation schemas
7. `src/hooks/useLeads.ts` - Data fetching hooks

### Phase 6: Tasks Module (Days 14-16)

**Files to create:**
1. `src/app/(dashboard)/tasks/page.tsx` - Tasks page
2. `src/components/tasks/TaskList.tsx` - Task list
3. `src/components/tasks/TaskCard.tsx` - Task card
4. `src/components/tasks/TaskForm.tsx` - Create/edit form
5. `src/lib/validations/task.ts` - Validation schemas
6. `src/hooks/useTasks.ts` - Data fetching hooks

### Phase 7: Projects, Research, Notes (Days 17-20)

Follow the same pattern as above for each module.

## 🎨 Code Patterns

### Data Fetching with TanStack Query

```typescript
// src/hooks/useClients.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useClients(workspaceId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['clients', workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (client: any) => {
      const { data, error } = await supabase
        .from('clients')
        .insert(client)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}
```

### Form with React Hook Form + Zod

```typescript
// src/components/clients/ClientForm.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const clientSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  status: z.string().default('active'),
})

type ClientFormValues = z.infer<typeof clientSchema>

export function ClientForm({ onSubmit }: { onSubmit: (data: ClientFormValues) => void }) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      company_name: '',
      website: '',
      industry: '',
      status: 'active',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Add more fields */}
        <Button type="submit">Create Client</Button>
      </form>
    </Form>
  )
}
```

## 📚 Reference Documentation

All detailed specifications are in the parent folder (`d:\projects\Notion\`):

- **AGENCY_OS_SCHEMA.sql** - Database structure
- **AGENCY_OS_API.md** - API endpoints
- **AGENCY_OS_UI_WIREFRAMES.md** - Design system
- **AGENCY_OS_ROADMAP.md** - Week-by-week guide
- **SETUP_GUIDE.md** - Supabase RLS policies

## 🚀 You're Ready!

You now have:
- ✅ Fully configured Next.js app
- ✅ Supabase clients ready
- ✅ Type definitions
- ✅ Utility functions
- ✅ Clear build plan

**Start with Step 1** (install shadcn/ui) and then begin building authentication!

Good luck! 🎉
