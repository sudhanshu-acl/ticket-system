import Link from 'next/link';
import { BlogPost } from '../utils/type';
import type { Metadata } from 'next'
import Search from '../components/Search';

// Add the metadata export for SEO and page info
export const metadata: Metadata = {
  title: 'My Blog',
  description: 'My personal blog',
}

async function fetchPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch('http://localhost:3000/api/blog', { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data as BlogPost[];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const query = (await searchParams)?.query || '';
  const posts = await fetchPosts();

  const filteredPosts = posts.filter((post) => {
    return (
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog</h1>

      <div className="mb-8">
        <Search />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 m-8">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No blog posts found matching "{query}".
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block border rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-[#540202] h-12 leading-tight overflow-hidden">{post.title.charAt(0).toUpperCase() + post.title.slice(1)}</h2>
              <p className="text-gray-700">
                {post.body.length > 100 ? `${post.body.slice(0, 100)}...` : post.body}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
