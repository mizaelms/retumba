"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Users, LayoutDashboard, LogOut } from "lucide-react"

export function AdminSidebar() {
    const pathname = usePathname()

    const items = [
        {
            title: "Posts",
            href: "/admin/posts",
            icon: FileText
        },
        {
            title: "Users",
            href: "/admin/users",
            icon: Users
        }
    ]

    return (
        <aside className="w-[200px] flex-col hidden md:flex border-r h-full min-h-[calc(100vh-64px)] p-4 bg-muted/10">
            <div className="mb-6 px-2 text-lg font-bold tracking-tight">
                Dashboard
            </div>
            <nav className="flex flex-col gap-2">
                {items.map(item => {
                    const Icon = item.icon
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link key={item.href} href={item.href}>
                            <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                                <Icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Button>
                        </Link>
                    )
                })}
            </nav>
            <div className="mt-auto">
                 <form action="/auth/signout" method="post">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
                         <LogOut className="mr-2 h-4 w-4" />
                         Sign Out
                    </Button>
                 </form>
            </div>
        </aside>
    )
}
