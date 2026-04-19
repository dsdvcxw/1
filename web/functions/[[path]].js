export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // 你的 Pages 项目域名（替换成你自己的）
    const mainDomain = 'site-test-609.pages.dev';
    
    // 提取完整的子域名部分（支持多级）
    let subdomain = '';
    if (hostname.endsWith(`.${mainDomain}`)) {
        subdomain = hostname.slice(0, -mainDomain.length - 1);
    }
    
    // 如果访问的是根域名（无子域名），则映射到 index.html
    if (subdomain === '') {
        // 根域名请求，直接返回 index.html
        const indexUrl = new URL('/index.html', url.origin);
        return await next(indexUrl);
    }
    
    // 将子域名中的点号保留，作为文件名的一部分
    // 例如 "a.b.c" -> "a.b.c.html"
    const targetFile = `/${subdomain}.html`;
    
    // 尝试重写到目标文件，如果文件不存在，Pages 会自动返回 404
    // 注意：这里无法预先检查文件是否存在，只能让 next() 去尝试
    const targetUrl = new URL(targetFile, url.origin);
    const response = await next(targetUrl);
    
    // 如果返回 404，可以自定义 404 页面
    if (response.status === 404) {
        // 可选：返回自定义 404.html（如果存在）
        const notFoundUrl = new URL('/404.html', url.origin);
        return await next(notFoundUrl).catch(() => new Response('Not Found', { status: 404 }));
    }
    
    return response;
}