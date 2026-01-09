import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TeachersTable from '@/components/TeachersTable'
function Teachers() {
  return (
    <div className='mt-10 p-4 bg-zinc-100 w-full h-full'>
      <TeachersTable/>
    </div>
  )
}

export default Teachers