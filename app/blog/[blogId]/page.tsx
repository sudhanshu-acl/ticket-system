import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CommentOnBlog } from '@/app/_components/comment';
import CommentLoading from '@/app/_components/comment-loading';
import React from 'react';

interface Params {
  params: { blogId: string };
}

async function fetchPost(blogId: string): Promise<any | undefined> {
  const res = await fetch(`http://localhost:3000/api/blog/${blogId}`);
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
  const { blogId } = await params;
  const post = await fetchPost(blogId);

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

      <h3 className="text-xl font-semibold mt-6 mb-4">Comments</h3>
      <React.Suspense fallback={<CommentLoading />}>
        {/* CommentOnBlog is async; Suspense fallback shows skeleton while loading */}
        <CommentOnBlog postId={blogId as string} />
      </React.Suspense>
    </div>
  );
}
