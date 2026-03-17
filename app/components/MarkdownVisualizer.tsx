"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownVisualizerProps {
    content: string;
    className?: string;
}

const MarkdownVisualizer: React.FC<MarkdownVisualizerProps> = ({ content, className = '' }) => {
    return (
        <div className={`markdown-body space-y-4 ${className}`}>
            <ReactMarkdown
                components={{
                    h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b pb-2 text-slate-900" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-slate-800" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-slate-800" {...props} />,
                    p: ({ node, ...props }) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mb-4 ml-4 text-slate-700" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mb-4 ml-4 text-slate-700" {...props} />,
                    li: ({ node, ...props }) => <li className="text-slate-700" {...props} />,
                    a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-blue-500 bg-blue-50 py-2 px-4 rounded-r-md text-slate-700 italic my-4" {...props} />
                    ),
                    code: ({ className, children, ...props }: { className?: string; children?: React.ReactNode }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className;
                        return isInline ? (
                            <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                            </code>
                        ) : (
                            <div className="relative group my-4">
                                {match && <div className="absolute top-0 right-0 bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-bl rounded-tr">{match[1]}</div>}
                                <code className="block bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm font-mono shadow-sm" {...props}>
                                    {children}
                                </code>
                            </div>
                        );
                    },
                    table: ({ node, ...props }) => (
                        <div className="overflow-x-auto my-6 border border-slate-200 rounded-lg">
                            <table className="min-w-full divide-y divide-slate-200" {...props} />
                        </div>
                    ),
                    th: ({ node, ...props }) => <th className="bg-slate-50 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider" {...props} />,
                    td: ({ node, ...props }) => <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 border-t border-slate-100" {...props} />,
                    hr: ({ node, ...props }) => <hr className="my-8 border-t border-slate-200" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownVisualizer;