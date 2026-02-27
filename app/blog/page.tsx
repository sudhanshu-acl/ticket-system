import Link from 'next/link';
import { BlogPost } from '../utils/type';

async function fetchPosts(): Promise<BlogPost[]> {
  const res = await fetch('http://localhost:3000/api/blog');
  const json = await res.json();
  return json.data as BlogPost[];
}

export default async function BlogPage() {
  const posts = await fetchPosts();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Blog</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 m-8">
        {posts.map((post) => (
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
        ))}
      </div>
    </div>
  );
}
