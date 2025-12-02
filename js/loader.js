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
            // Only intercept internal links that don't open in a new tab
            if (href && !href.startsWith('#') && !href.startsWith('javascript') && !this.target) {
                e.preventDefault();

                // Step 1: Fade out the current page content
                document.body.classList.add('content-fade-out');

                // Step 2: After content fades out, show the loader and navigate
                setTimeout(() => {
                    // document.body.classList.remove('content-fade-out'); // Not strictly needed as page navigates
                    const loader = document.getElementById('page-loader');
                    if (loader) {
                        loader.style.display = 'flex';
                        requestAnimationFrame(() => {
                            loader.style.opacity = '1';
                        });
                    }

                    setTimeout(() => {
                        window.location.href = href;
                    }, 500); // Wait for loader fade in
                }, 500); // Wait for content fade out (match .content-fade-out transition duration)
            }
        });
    });
});
