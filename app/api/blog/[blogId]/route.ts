import { NextRequest } from 'next/server';

//  single post
export async function GET(request: NextRequest, { params }: { params: { blogId: string } }) {
  const { blogId } = await params;
  console.log('Blogs params ', blogId);
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${blogId}`);
    const data = await res.json();

    return Response.json({
      statusCode: 200,
      success: true,
      message: 'Post fetched successfully',
      data,
    });
  } catch (error) {
    return new Response('Failed to fetch post', { status: 500 });
  }
}
