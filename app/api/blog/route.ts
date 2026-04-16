import { logger } from '@/app/lib/logger';

async function fetchData() {
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        logger.info('[BLOG] Data fetched successfully', { res });
        return res.json();
    } catch (error) {
        logger.error('[BLOG] Error fetching data', { error });
    }
}

export async function GET() {
    const postData = await fetchData();
    logger.info('[BLOG] Data fetched successfully', { postData });

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
            .then((data) => {
                logger.info('[BLOG] Data created successfully', { data });
            })

        return Response.json({
            statusCode: 200,
            success: true,
            message: "Data created successfully",
            data: req
        })
    } catch (reason) {
        logger.error('[BLOG] Error creating data', { reason });
        const message =
            reason instanceof Error ? reason.message : 'Unexpected error'

        return new Response(message, { status: 500 })
    }
}