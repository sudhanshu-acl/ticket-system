'use client'

import React, { useState } from 'react'
import { Toast, ToastType } from './toast'

interface CreateAITicketModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (query: string) => void
    loading: boolean
}

const CreateAITicketModal: React.FC<CreateAITicketModalProps> = ({ isOpen, onClose, onSubmit, loading }) => {
    const [query, setQuery] = useState('')
    const [toast, setToast] = useState<{ message: string, type: ToastType } | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!query.trim()) {
            setToast({ message: 'Please enter a description for your ticket.', type: 'danger' })
            return
        }
        onSubmit(query)
    }

    // Effect to reset query when modal closes or opens
    React.useEffect(() => {
        if (isOpen) {
            setQuery('')
            setToast(null)
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {toast && (
                <div className="fixed top-4 right-4 z-[60]">
                    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
                </div>
            )}
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-slate-900">Create Ticket with AI</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto w-full">
                    <div>
                        <label className="block text-sm font-medium text-slate-900 mb-1">Describe your issue *</label>
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            required
                            disabled={loading}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                            placeholder="e.g., My laptop screen has been flickering since yesterday and is completely unusable now. It is urgent."
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Our AI will automatically categorize, prioritize, and format your ticket based on this description.
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-wrap">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 text-slate-900 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={(e) => handleSubmit(e as any)}
                        disabled={loading || !query.trim()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Generate Ticket
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateAITicketModal
