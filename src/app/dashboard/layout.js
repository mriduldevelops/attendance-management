import { AppSidebar } from '@/components/app-sidebar'
import { CustomTrigger } from '@/components/CustomTrigger'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

function layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                {/* <SidebarTrigger /> */}
                <CustomTrigger/>
                {children}
            </main>
        </SidebarProvider>
    )
}

export default layout