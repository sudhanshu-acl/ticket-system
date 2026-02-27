import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Params {
  params: { id: string };
}

async function fetchPost(id: string): Promise<any | undefined> {
  const res = await fetch(`/api/blog/${id}`);
  const json = await res.json();
  // json.data will be the single post object
  return json.data as any;
}

export async function generateStaticParams() {
  // fetch a list of posts and return their ids for static generation
  const res = await fetch('http://localhost:3000/api/blog');
  const json = await res.json();
  const data: any[] = json.data;
  return data.slice(0, 10).map((post) => ({ blogId: post.id.toString() }));
}

export default async function BlogDetail({ params }: Params) {
  const post = await fetchPost(params.id);

  console.log("Post ", params);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post?.title}</h1>
      <p className="text-gray-800 mb-6">{post?.body}</p>
      <Link
        href="/blog"
        className="inline-block text-blue-500 hover:underline"
      >
        ← Back to blog list
      </Link>
    </div>
  );
}
