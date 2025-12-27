import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Proxy for Bungee API
 * Handles: /api/bungee-proxy/* -> https://backend.bungee.exchange/*
 */

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Get the path after /api/bungee-proxy
        const url = new URL(req.url || '', `https://${req.headers.host}`);
        const targetPath = url.pathname.replace('/api/bungee-proxy', '');
        const targetUrl = `https://backend.bungee.exchange${targetPath}${url.search}`;

        console.log('[Bungee Proxy] Forwarding to:', targetUrl);

        // Forward the request
        const response = await fetch(targetUrl, {
            method: req.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'JustFlip-Bridge/1.0',
            },
            body: req.method !== 'GET' && req.body ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.text();

        // Forward response
        res.status(response.status);
        res.setHeader('Content-Type', 'application/json');
        return res.send(data);
    } catch (error) {
        console.error('[Bungee Proxy] Error:', error);
        return res.status(500).json({
            error: 'Proxy error',
            message: String(error)
        });
    }
}