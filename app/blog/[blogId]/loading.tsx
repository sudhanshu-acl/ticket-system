import Skeleton from "../../components/Skeleton";

const BlogDetailLoading = () => {
  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="mt-6">
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
};

export default BlogDetailLoading;
