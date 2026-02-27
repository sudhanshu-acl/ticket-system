const fetchComments = async (postId: string) => {
    try {
        const res = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error('Failed to fetch comments', error);
        return [];
    }
}
export const CommentOnBlog = async ({ postId }: { postId: string }) => {

    const comments = await fetchComments(postId); // postId comes from props
    return (
        <div className="grid grid-cols-1 gap-4">
            {comments.map((comment: any) => (
                <div key={comment.id} className="border rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">{comment.email}</div>
                    <h3 className="text-lg font-semibold mb-2">{comment.name.charAt(0).toUpperCase() + comment.name.slice(1)}</h3>
                    <p className="text-gray-700">{comment.body}</p>
                </div>
            ))}
        </div>
    )
}
