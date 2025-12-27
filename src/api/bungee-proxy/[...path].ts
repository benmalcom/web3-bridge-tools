/**
 * Vercel Serverless Proxy for Bungee API
 * Bypasses CORS/Cloudflare restrictions by proxying requests server-side
 */

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    const url = new URL(request.url);

    // Get the path after /api/bungee-proxy
    const targetPath = url.pathname.replace('/api/bungee-proxy', '');
    const targetUrl = `https://backend.bungee.exchange${targetPath}${url.search}`;

    try {
        // Forward the request to Bungee backend
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Forward API key if present
                ...(request.headers.get('x-api-key') && {
                    'x-api-key': request.headers.get('x-api-key')!,
                }),
            },
            body: request.method !== 'GET' ? await request.text() : undefined,
        });

        const data = await response.text();

        return new Response(data, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
            },
        });
    } catch (error) {
        console.error('Bungee proxy error:', error);
        return new Response(
            JSON.stringify({ error: 'Proxy error', message: String(error) }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );
    }
}