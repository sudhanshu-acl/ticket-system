async function fetchData() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        return res.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

export async function GET() {
    const postData = await fetchData();

    return Response.json({
        statusCode: 200,
        success: true,
        message: "Data fetched successfully",
        data: postData
    })
}

export async function POST(request: Request) {
    try {
        const req = await request.json();
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(req),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())

        return Response.json({
            statusCode: 200,
            success: true,
            message: "Data created successfully",
            data: req
        })
    } catch (reason) {
        const message =
            reason instanceof Error ? reason.message : 'Unexpected error'

        return new Response(message, { status: 500 })
    }
}