'use client'

import { useState } from 'react'

export default function ReportsPage() {
    const [report, setReport] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleGenerateReport = async () => {
        setLoading(true)
        setError(null)
        setReport(null)

        try {
            const res = await fetch('/api/reports/analyze', {
                method: 'GET',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate report')
            }

            setReport(data.data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!report) return
        const blob = new Blob([report], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `system-report-${new Date().toISOString().split('T')[0]}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
                    <p className="text-slate-600 mt-1">Analyze application logs using AI</p>
                </div>

                <button
                    onClick={handleGenerateReport}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Analyzing Logs...
                        </>
                    ) : (
                        <>
                            <span>✨</span> Generate AI Log Report
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    <p className="font-semibold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                    <div className="bg-slate-200 h-14 w-full"></div>
                    <div className="p-6 space-y-6">
                        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        </div>
                        <div className="h-6 bg-slate-200 rounded w-1/3 mt-8"></div>
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                        </div>
                    </div>
                </div>
            )}

            {report && !loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                        <h2 className="font-semibold text-lg flex items-center gap-2">
                            <span>🤖</span> AI Diagnostics Report
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">Generated Just Now</span>
                            <button
                                onClick={handleDownload}
                                className="p-1.5 hover:bg-slate-700 rounded transition-colors"
                                title="Download Report"
                            >
                                <svg className="w-4 h-4 text-slate-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="p-6 prose prose-slate max-w-none prose-headings:font-semibold prose-a:text-blue-600">
                        {/* Extremely simple markdown rendering fallback without heavy libraries */}
                        {report.split('\n').map((line, i) => {
                            if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-3 text-slate-800">{line.replace('### ', '')}</h3>
                            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-slate-900 border-b pb-2">{line.replace('## ', '')}</h2>
                            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-4 text-slate-900">{line.replace('# ', '')}</h1>
                            if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-slate-700">{line.replace('- ', '')}</li>
                            if (line.startsWith('* ')) return <li key={i} className="ml-4 mb-1 text-slate-700">{line.replace('* ', '')}</li>
                            if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-4 mb-1 font-medium text-slate-800">{line}</li>
                            if (line.trim() === '') return <br key={i} />

                            // Handle bolding
                            let formattedLine = line;
                            const boldRegex = /\*\*(.*?)\*\*/g;
                            if (boldRegex.test(formattedLine)) {
                                const parts = formattedLine.split(boldRegex);
                                return (
                                    <p key={i} className="mb-3 text-slate-700 leading-relaxed">
                                        {parts.map((part, index) => index % 2 === 1 ? <strong key={index} className="text-slate-900">{part}</strong> : part)}
                                    </p>
                                );
                            }
                            return <p key={i} className="mb-3 text-slate-700 leading-relaxed">{line}</p>
                        })}
                    </div>
                </div>
            )}

            {!report && !loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-12 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        📊
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Report Generated Yet</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        Click the "Generate AI Log Report" button above to have our AI analyze the recent system logs, identify errors, and suggest fixes.
                    </p>
                </div>
            )}
        </div>
    )
}
