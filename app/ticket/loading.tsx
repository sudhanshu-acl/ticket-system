const Loading = () => {
    // Generate an array of 5 items to represent loading rows
    const loadingRows = Array.from({ length: 5 }, (_, i) => i);

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between w-full">
                        {/* View Toggle Skeleton */}
                        <div className="flex bg-gray-200 rounded-lg shadow-sm border border-gray-100 h-10 w-24"></div>
                        {/* Create Button Skeleton */}
                        <div className="h-10 bg-gray-300 rounded-md w-32 shadow-sm"></div>
                    </div>
                </div>

                {/* Ticket Count Skeleton */}
                <div className="mb-4 h-5 bg-gray-200 rounded w-40"></div>

                {/* Table Skeleton */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {[...Array(7)].map((_, index) => (
                                    <th key={index} className="px-6 py-3">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loadingRows.map((row) => (
                                <tr key={row}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Loading;