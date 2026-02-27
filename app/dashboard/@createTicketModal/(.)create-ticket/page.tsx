'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import CreateTicketModal from '@/app/components/CreateTicketModal'
import { TicketFormData } from '@/app/components/CreateTicketModal'

export default function CreateTicketPage() {
  const router = useRouter()

  const handleCreateTicket = (ticketData: TicketFormData) => {
    console.log('New ticket created via parallel route:', ticketData)
    alert(`Ticket created: ${ticketData.title}`)
    router.back()
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <CreateTicketModal
      isOpen={true}
      onClose={handleClose}
      onSubmit={handleCreateTicket}
    />
  )
}
