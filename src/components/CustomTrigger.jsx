"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeftIcon } from "lucide-react"

export function CustomTrigger() {
    const { toggleSidebar } = useSidebar()

    return (
        <div className="max-w-screen min-w-full bg-blue-400 text-white py-2 px-4 fixed flex items-center gap-2">
            <button onClick={toggleSidebar} className="cursor-pointer"> <PanelLeftIcon size={16}/></button>
            <p>Dashboard</p>
        </div>
    )
}