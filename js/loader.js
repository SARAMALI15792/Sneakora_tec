document.addEventListener("DOMContentLoaded", () => {
    // Create Loader Element if it doesn't exist
    if (!document.getElementById('page-loader')) {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    }

    // Hide Loader after a short delay (simulating load or waiting for content)
    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 800); // Min 800ms loader

    // Intercept Links for Transition
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only intercept internal links
            if (href && !href.startsWith('#') && !href.startsWith('javascript') && !this.target) {
                e.preventDefault();
                const loader = document.getElementById('page-loader');
                loader.style.display = 'flex';
                // Small delay to allow display:flex to apply before opacity change
                requestAnimationFrame(() => {
                    loader.style.opacity = '1';
                });

                setTimeout(() => {
                    window.location.href = href;
                }, 500); // Wait for fade in
            }
        });
    });
});
