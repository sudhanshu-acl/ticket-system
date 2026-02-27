import Skeleton from "../components/Skeleton";

const loading = () => {
  // mimic 6 placeholders in same grid used by posts
  const placeholders = Array.from({ length: 100 }, (_, i) => i);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {placeholders.map((idx) => (
          <div
            key={idx}
            className="block border rounded-lg p-4"
          >
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default loading