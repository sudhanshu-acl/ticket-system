'use client'

import React, { useState, useEffect } from 'react'
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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import MarkdownVisualizer from './MarkdownVisualizer'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#64748b'] // Open, In Progress, Resolved, Closed
const PRIORITY_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444'] // Low, Medium, High, Critical

interface AnalyticsReport {
    filename: string;
    range: string;
    createdAt: string;
    size: number;
}

interface ReportData {
    analysis: string;
    charts: {
        status: any[];
        priority: any[];
        trend: any[];
    };
    range: string;
    createdAt: string;
}

interface TicketAnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TicketAnalyticsModal({ isOpen, onClose }: TicketAnalyticsModalProps) {
    const queryClient = useQueryClient();
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [selectedFilename, setSelectedFilename] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [timeRange, setTimeRange] = useState('month')

    // Fetch list of saved analytics
    const { data: savedReportsData, isLoading: isListLoading, error: listError } = useQuery<{ data: AnalyticsReport[] }>({
        queryKey: ['savedAnalytics'],
        queryFn: async () => {
            const res = await fetch('/api/reports/analytics/saved');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch saved analytics');
            return data;
        },
        enabled: isOpen
    });

    const savedReports = savedReportsData?.data || [];
    
    useEffect(() => {
        console.log('[UI-Analytics] Saved Reports List Updated:', savedReports);
    }, [savedReports]);

    useEffect(() => {
        if (listError) console.error('[UI-Analytics] List Fetch Error:', listError);
    }, [listError]);


    // Fetch specific report content
    useEffect(() => {
        if (!selectedFilename || !isOpen) return;

        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/reports/analytics/saved/${selectedFilename}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to load report');
                setReportData(data.data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Failed to load report');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [selectedFilename, isOpen]);

    const handleGenerateReport = async () => {
        setIsStreaming(true);
        setError(null);
        setReportData(null);
        setSelectedFilename(null);

        try {
            const res = await fetch(`/api/reports/tickets?range=${timeRange}`, { method: 'GET' });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Failed to generate report');
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error('Response body is not streamable');
            
            const decoder = new TextDecoder();
            let done = false;
            let buffer = '';
            let newFilename = '';
            
            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                
                if (value) {
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';
                    
                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const data = JSON.parse(line);
                            if (data.type === 'metadata') {
                                setReportData({
                                    analysis: '',
                                    charts: data.charts,
                                    range: data.range,
                                    createdAt: data.createdAt
                                });
                                newFilename = data.filename;
                            } else if (data.type === 'text') {
                                setReportData((prev: any) => ({
                                    ...prev,
                                    analysis: (prev?.analysis || '') + data.chunk
                                }));
                            } else if (data.type === 'error') {
                                throw new Error(data.error);
                            }
                        } catch (parseError) {
                            console.error("Failed to parse stream line", line, parseError);
                        }
                    }
                }
            }
            if (newFilename) {
                setSelectedFilename(newFilename);
                queryClient.invalidateQueries({ queryKey: ['savedAnalytics'] });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsStreaming(false);
        }
    }

    const handleDownload = () => {
        if (!reportData?.analysis) return
        const blob = new Blob([reportData.analysis], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = selectedFilename || `ticket-analytics-${new Date().toISOString().split('T')[0]}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (!isOpen) return null;

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
                            disabled={isStreaming}
                            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50"
                        >
                            <option value="week">Past Week</option>
                            <option value="month">Past Month</option>
                            <option value="year">Past Year</option>
                            <option value="all">All Time</option>
                        </select>

                        <button
                            onClick={handleGenerateReport}
                            disabled={isStreaming}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                        >
                            {isStreaming ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Aggregating...
                                </>
                            ) : (
                                <>
                                    <span>✨</span> Generate New Report
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                            <p className="font-semibold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* History Sidebar */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full min-h-[400px] lg:max-h-[600px]">
                            <div className="bg-slate-50 border-b border-gray-200 px-4 py-3 shrink-0">
                                <h3 className="font-semibold text-slate-800 text-sm">Report History</h3>
                            </div>
                            <div className="overflow-y-auto p-2 space-y-1 flex-1 min-h-0">
                                {isListLoading && (
                                    <div className="p-4 space-y-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="animate-pulse flex flex-col gap-2">
                                                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {listError && (
                                    <div className="p-4 text-center text-xs text-red-500">
                                        Failed to load history.
                                    </div>
                                )}
                                {!isListLoading && !listError && savedReports.length === 0 && (
                                    <div className="p-4 text-center text-xs text-gray-500">
                                        No reports saved yet.
                                    </div>
                                )}
                                {!isListLoading && !listError && savedReports.map((item) => (
                                    <button
                                        key={item.filename}
                                        onClick={() => setSelectedFilename(item.filename)}
                                        className={`w-full text-left px-3 py-2 rounded-lg border-l-4 transition-all text-xs ${selectedFilename === item.filename ? 'bg-blue-50 border-blue-500 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                                    >
                                        <div className="flex flex-col">
                                            <span className={`font-semibold ${selectedFilename === item.filename ? 'text-blue-800' : 'text-slate-700'}`}>
                                                {formatDate(item.createdAt)}
                                            </span>
                                            <span className="text-slate-500 mt-0.5 capitalize">
                                                Range: {item.range}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Report Area */}
                        <div className="lg:col-span-3 space-y-6">
                            {(loading || isStreaming) && !reportData && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                                    <div className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="h-64 bg-slate-100 rounded-xl"></div>
                                            <div className="h-64 bg-slate-100 rounded-xl"></div>
                                        </div>
                                        <div className="h-6 bg-slate-100 rounded w-1/4 mt-8"></div>
                                        <div className="space-y-3 mt-4">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
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
                                                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 hidden sm:inline capitalize">Range: {reportData.range}</span>
                                                {isStreaming && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded animate-pulse border border-blue-500/30 hidden sm:inline">Streaming...</span>}
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
                                        <MarkdownVisualizer content={reportData.analysis} className="p-6 prose-slate max-w-none" />
                                    </div>
                                </div>
                            )}

                            {!reportData && !loading && !isStreaming && !error && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-12 text-center h-[500px] flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                        📈
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No Report Selected</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">
                                        Select a report from the history on the left, or click &quot;Generate New Report&quot; to have AI analyze your system.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
