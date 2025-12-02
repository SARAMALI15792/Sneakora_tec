// Hero Shoe Image Switcher
let currentShoeIndex = 0;
let autoSwitchInterval; // Declare at top level
const shoeColors = ['pink', 'cyan', 'green', 'purple']; // Must match keys in imageMap

const shoePrices = {
    'pink': '$120.00',
    'cyan': '$130.00',
    'green': '$115.00',
    'purple': '$140.00'
};


function getRandomHoursRemainingText() {
    const randomHours = Math.floor(Math.random() * 11) + 1; // Random hours between 1 and 12
    return `Ends in: ${randomHours}h left`;
}


function updateDealRibbon(text) {
    const ribbonText = document.getElementById('ribbonText');
    if (ribbonText) {
        ribbonText.innerHTML = ''; // Clear existing text
        let i = 0;
        const speed = 50; // Typing speed in milliseconds

        function typeWriter() {
            if (i < text.length) {
                ribbonText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        typeWriter();
    }
}

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

        updateDealRibbon(getRandomHoursRemainingText()); // Update ribbon with random hours IMMEDIATELY

        setTimeout(() => {
            heroShoeImage.src = newImagePath;
            heroShoeImage.style.opacity = '1';
            heroShoeImage.style.transform = 'scale(1)';
        }, 200);

        // Update active state for thumbnails
        const thumbnails = document.querySelectorAll('.color-controls img');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.onclick && thumb.onclick.toString().includes(`'${color}'`)) {
                thumb.classList.add('active');
            }
        });
    }
}

function autoChangeShoeImage() {
    currentShoeIndex = (currentShoeIndex + 1) % shoeColors.length;
    changeShoeImage(shoeColors[currentShoeIndex]);
}


// Initialize - set cyan as default and start auto-switching
document.addEventListener('DOMContentLoaded', function () {
    const heroShoeImage = document.querySelector('.hero-shoe-image');
    if (heroShoeImage) {
        // Set initial deal message
        // Initial price will be set by changeShoeImage

        // Find the index of 'cyan' to start from
        const initialColor = 'cyan';
        currentShoeIndex = shoeColors.indexOf(initialColor);
        if (currentShoeIndex === -1) {
            currentShoeIndex = 0; // Default to first if not found
        }

        // Set initial image and active thumbnail
        changeShoeImage(shoeColors[currentShoeIndex]);

        // Add transition styles (ensure this is set after initial src to avoid initial flicker)
        heroShoeImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // Start automatic switching
        autoSwitchInterval = setInterval(autoChangeShoeImage, 4000);
    }

    // Attach event listeners for manual clicks
    const thumbnails = document.querySelectorAll('.color-controls img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (event) => {
            // Extract color from onclick attribute
            const colorMatch = event.target.onclick.toString().match(/changeShoeImage\('(\w+)'\)/);
            if (colorMatch && colorMatch[1]) {
                const clickedColor = colorMatch[1];
                currentShoeIndex = shoeColors.indexOf(clickedColor);
                if (currentShoeIndex === -1) {
                    currentShoeIndex = 0; // Fallback
                }
                changeShoeImage(clickedColor);
                // Reset the interval if user manually changes image
                clearInterval(autoSwitchInterval);
                autoSwitchInterval = setInterval(autoChangeShoeImage, 4000);
            }
        });
    });

    });