'use client'


import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import MarkdownVisualizer from '../../components/MarkdownVisualizer'

interface SavedReport {
    filename: string;
    createdAt: string;
    size: number;
}

export default function ReportsPage() {
    const queryClient = useQueryClient();
    const [selectedFilename, setSelectedFilename] = useState<string | null>(null)
    const [reportContent, setReportContent] = useState<string | null>(null)
    const [isLoadingContent, setIsLoadingContent] = useState(false)
    const [contentError, setContentError] = useState<string | null>(null)

    // Fetch list of saved reports
    const { data: savedReports, isLoading: isListLoading, error: listError } = useQuery<SavedReport[]>({
        queryKey: ['savedReports'],
        queryFn: async () => {
            const res = await fetch('/api/reports/saved');
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to fetch saved reports');
            return data.data;
        }
    });

    useEffect(() => {
        console.log('[UI-Logs] Saved Reports List Updated:', savedReports);
    }, [savedReports]);

    useEffect(() => {
        if (listError) console.error('[UI-Logs] List Fetch Error:', listError);
    }, [listError]);

    console.log('Saved Reports List:', savedReports);

    // Fetch single report content when selected
    useEffect(() => {
        if (!selectedFilename) {
            setReportContent(null);
            return;
        }

        const fetchContent = async () => {
            setIsLoadingContent(true);
            setContentError(null);
            try {
                const res = await fetch(`/api/reports/saved/${selectedFilename}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to fetch report content');
                setReportContent(data.data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setContentError(errorMessage);
            } finally {
                setIsLoadingContent(false);
            }
        };

        fetchContent();
    }, [selectedFilename]);

    // Generate new report mutation
    const generateMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch('/api/reports/analyze', { method: 'GET' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to generate report');
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['savedReports'] });
            setSelectedFilename(data.filename);
            setReportContent(data.data);
        }
    });

    const handleGenerateReport = async () => {
        generateMutation.mutate();
    }

    const handleDownload = () => {
        if (!reportContent || !selectedFilename) return
        const blob = new Blob([reportContent], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = selectedFilename
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Reports</h1>
                    <p className="text-slate-600 mt-1">Analyze application logs using AI</p>
                </div>

                <button
                    onClick={handleGenerateReport}
                    disabled={generateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    {generateMutation.isPending ? (
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

            {generateMutation.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    <p className="font-semibold">Error Generating Report</p>
                    <p>{generateMutation.error.message}</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar: History */}
                <div className="lg:w-1/3 xl:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[800px]">
                    <div className="bg-slate-50 border-b border-gray-200 px-4 py-3">
                        <h3 className="font-semibold text-slate-800">Report History</h3>
                    </div>
                    <div className="overflow-y-auto p-2 space-y-1 relative">
                        {isListLoading && (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse flex flex-col gap-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {listError && (
                            <div className="p-4 text-sm text-red-600">Failed to load history.</div>
                        )}
                        {!isListLoading && savedReports?.length === 0 && (
                            <div className="p-6 text-center text-sm text-gray-500">
                                No reports saved yet.
                            </div>
                        )}
                        {!isListLoading && (savedReports || []).map((item) => (
                            <button
                                key={item.filename}
                                onClick={() => setSelectedFilename(item.filename)}
                                className={`w-full text-left px-4 py-3 rounded-lg border-l-4 transition-colors ${selectedFilename === item.filename ? 'bg-blue-50 border-blue-500 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
                            >
                                <div className="flex flex-col">
                                    <span className={`text-sm font-medium ${selectedFilename === item.filename ? 'text-blue-800' : 'text-slate-700'}`}>
                                        {formatDate(item.createdAt)}
                                    </span>
                                    <span className="text-xs text-slate-500 mt-1 truncate">
                                        {item.filename} • {(item.size / 1024).toFixed(1)} KB
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {(isLoadingContent || generateMutation.isPending) && (
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

                    {contentError && !isLoadingContent && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                            <p className="font-semibold">Error Loading Content</p>
                            <p>{contentError}</p>
                        </div>
                    )}

                    {reportContent && !isLoadingContent && !generateMutation.isPending && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <h2 className="font-semibold text-lg flex items-center gap-2">
                                    <span>🤖</span> AI Diagnostics Report
                                </h2>
                                <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                                    <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 truncate max-w-[150px] sm:max-w-none">
                                        {selectedFilename}
                                    </span>
                                    <button
                                        onClick={handleDownload}
                                        className="p-1.5 hover:bg-slate-700 rounded transition-colors ml-auto sm:ml-0 shrink-0"
                                        title="Download Report"
                                    >
                                        <svg className="w-4 h-4 text-slate-300 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <MarkdownVisualizer content={reportContent} className="p-6 prose-slate max-w-none" />
                        </div>
                    )}

                    {!reportContent && !isLoadingContent && !generateMutation.isPending && !contentError && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 border-dashed p-12 text-center h-full flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                                📊
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Report Selected</h3>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Click the &quot;Generate AI Log Report&quot; button above to have our AI analyze recent system logs, or select a previously saved report from the history sidebar.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
