// Hero Shoe Image Switcher
function changeShoeImage(color) {
    const heroShoeImage = document.querySelector('.hero-shoe-image');

    if (!heroShoeImage) return;

    // Map colors to image paths
    const imageMap = {
        'pink': 'images/shoe_pink.png',
        'cyan': 'images/shoe_cyan.png',
        'green': 'images/shoe_green.png',
        'purple': 'images/shoe_purple.png'
    };

    // Get the new image path
    const newImagePath = imageMap[color];

    if (newImagePath) {
        // Add a smooth transition effect
        heroShoeImage.style.opacity = '0';
        heroShoeImage.style.transform = 'scale(0.95)';

        setTimeout(() => {
            heroShoeImage.src = newImagePath;
            heroShoeImage.style.opacity = '1';
            heroShoeImage.style.transform = 'scale(1)';
        }, 200);

        // Add active state to clicked thumbnail
        const thumbnails = document.querySelectorAll('.color-controls img');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });

        // Add active class to clicked thumbnail
        event.target.classList.add('active');
    }
}

// Initialize - set cyan as default
document.addEventListener('DOMContentLoaded', function () {
    const heroShoeImage = document.querySelector('.hero-shoe-image');
    if (heroShoeImage) {
        // Set default image to cyan
        heroShoeImage.src = 'images/shoe_cyan.png';

        // Add transition styles
        heroShoeImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // Set first thumbnail as active (cyan)
        const cyanThumbnail = document.querySelector('.color-controls img[onclick*="cyan"]');
        if (cyanThumbnail) {
            cyanThumbnail.classList.add('active');
        }
    }
});
