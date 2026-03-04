'use client'

import React, { useState } from 'react'
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#64748b'] // Open, In Progress, Resolved, Closed
const PRIORITY_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'] // Low, Medium, High, Critical

interface TicketAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TicketAnalyticsModal({ isOpen, onClose }: TicketAnalyticsModalProps) {
    const [reportData, setReportData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [timeRange, setTimeRange] = useState('month')

    if (!isOpen) return null;

    const handleGenerateReport = async () => {
        setLoading(true)
        setError(null)
        setReportData(null)

        try {
            const res = await fetch(`/api/reports/tickets?range=${timeRange}`, {
                method: 'GET',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to generate report')
            }

            setReportData(data.data) // Contains .analysis and .charts
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!reportData?.analysis) return
        const blob = new Blob([reportData.analysis], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ticket-analytics-${new Date().toISOString().split('T')[0]}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col my-8">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">AI Ticket Analytics</h2>
                        <p className="text-sm text-slate-500 mt-1">Visualize ticket trends and get actionable AI insights.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            disabled={loading}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
                        >
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                            <option value="year">Past Year</option>
                            <option value="all">All Time</option>
                        </select>

                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Aggregating...
                                </>
                            ) : (
                                <>
                                    <span>✨</span> Generate Report
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
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="h-64 bg-slate-200 rounded-xl"></div>
                                    <div className="h-64 bg-slate-200 rounded-xl"></div>
                                </div>
                                <div className="h-6 bg-slate-200 rounded w-1/4 mt-8"></div>
                                <div className="space-y-3 mt-4">
                                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {reportData && !loading && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status Pie Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tickets by Status</h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={reportData.charts.status}
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                                                >
                                                    {reportData.charts.status.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Priority Bar Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Tickets by Priority</h3>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={reportData.charts.priority} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip
                                                    cursor={{ fill: '#f1f5f9' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    {reportData.charts.priority.map((entry: any, index: number) => (
                                                        <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Ticket Volume Trends</h3>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={reportData.charts.trend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} minTickGap={30} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                                    <h2 className="font-semibold text-lg flex items-center gap-2">
                                        <span>🤖</span> AI ITSM Insights
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 hidden sm:inline">Generated for {timeRange}</span>
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
                                    {reportData.analysis.split('\n').map((line: string, i: number) => {
                                        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-6 mb-3 text-slate-800">{line.replace('### ', '')}</h3>
                                        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-8 mb-4 text-slate-900 border-b pb-2">{line.replace('## ', '')}</h2>
                                        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-4 text-slate-900">{line.replace('# ', '')}</h1>
                                        if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1 text-slate-700">{line.replace('- ', '')}</li>
                                        if (line.startsWith('* ')) return <li key={i} className="ml-4 mb-1 text-slate-700">{line.replace('* ', '')}</li>
                                        if (line.match(/^\d+\.\s/)) return <li key={i} className="ml-4 mb-1 font-medium text-slate-800">{line}</li>
                                        if (line.trim() === '') return <br key={i} />

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
                        </div>
                    )}

                    {!reportData && !loading && !error && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-12 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                📈
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Report Generated Yet</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-6">
                                Select a time range and click the "Generate Report" button to have AI analyze your ticketing volume, prioritize trends, and provide insights.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
