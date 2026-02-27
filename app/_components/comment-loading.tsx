import Skeleton from '@/app/components/Skeleton'

const CommentLoading = () => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="border rounded-lg p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="border rounded-lg p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="border rounded-lg p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-5 w-2/3 mb-3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

export default CommentLoading
