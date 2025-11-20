const container = document.getElementById('canvas-container');

// Scene setup
const scene = new THREE.Scene();
scene.background = null; // Transparent background to show CSS background if needed, or keep color
// scene.background = new THREE.Color(0xF3F5F9); // Let's keep it transparent for now to blend with page
scene.fog = new THREE.FogExp2(0xF3F5F9, 0.02);

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
// Move camera back a bit to see more width
camera.position.set(0, 0, 6);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// --- Image Texture Shoe ---
const textureLoader = new THREE.TextureLoader();
const textures = {
    pink: textureLoader.load('images/shoe_pink.png'),
    cyan: textureLoader.load('images/shoe_cyan.png'),
    green: textureLoader.load('images/shoe_green.png'),
    purple: textureLoader.load('images/shoe_purple.png')
};

// Main Shoe Group
const mainShoeGroup = new THREE.Group();
scene.add(mainShoeGroup);

// Position Main Shoe to the CENTER of the canvas (which is now on the right)
mainShoeGroup.position.set(0, 0, 0);

const geometry = new THREE.PlaneGeometry(5, 3);
const material = new THREE.MeshBasicMaterial({
    map: textures.cyan, // Default
    transparent: true,
    side: THREE.DoubleSide
});

const shoePlane = new THREE.Mesh(geometry, material);
mainShoeGroup.add(shoePlane);

// Shadow for Main Shoe
const shadowGeo = new THREE.PlaneGeometry(4, 1);
const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.2
});
const shadow = new THREE.Mesh(shadowGeo, shadowMat);
shadow.rotation.x = -Math.PI / 2;
shadow.position.y = -1.5;
mainShoeGroup.add(shadow);

// --- Background Floating Shoes ---
const bgShoes = [];
const bgShoeCount = 8; // Increased count for background

for (let i = 0; i < bgShoeCount; i++) {
    const bgGroup = new THREE.Group();

    // Random Texture
    const keys = Object.keys(textures);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];

    const bgMat = new THREE.MeshBasicMaterial({
        map: textures[randomKey],
        transparent: true,
        opacity: 0.25, // Lower opacity for background
        side: THREE.DoubleSide
    });

    const bgPlane = new THREE.Mesh(geometry, bgMat);
    // Random Scale
    const scale = 0.2 + Math.random() * 0.3;
    bgGroup.scale.set(scale, scale, scale);

    // Random Position (Restricted to avoid main shoe area)
    // Keep them mostly on the left or far back
    bgGroup.position.x = (Math.random() * 12) - 8; // -8 to 4

    // If x is > 1 (near main shoe), push z back significantly
    if (bgGroup.position.x > 1) {
        bgGroup.position.z = (Math.random() * 5) - 8; // -8 to -3
    } else {
        bgGroup.position.z = (Math.random() * 6) - 4; // -4 to 2
    }

    bgGroup.position.y = (Math.random() * 8) - 4; // -4 to 4

    // Random Rotation Speed
    bgGroup.userData = {
        rotSpeed: (Math.random() * 0.01) + 0.002,
        floatSpeed: (Math.random() * 0.002) + 0.001,
        floatOffset: Math.random() * Math.PI * 2
    };

    bgGroup.add(bgPlane);
    scene.add(bgGroup);
    bgShoes.push(bgGroup);
}


// --- Interaction (Texture Swapping) ---
window.changeShoeTexture = function (colorName) {
    if (textures[colorName]) {
        material.map = textures[colorName];
        material.needsUpdate = true;

        // Pop animation
        let scale = 1;
        const popInterval = setInterval(() => {
            scale += 0.05;
            mainShoeGroup.scale.set(scale, scale, scale);
            if (scale >= 1.1) {
                clearInterval(popInterval);
                const shrinkInterval = setInterval(() => {
                    scale -= 0.05;
                    mainShoeGroup.scale.set(scale, scale, scale);
                    if (scale <= 1) {
                        mainShoeGroup.scale.set(1, 1, 1);
                        clearInterval(shrinkInterval);
                    }
                }, 16);
            }
        }, 16);
    }
}

// --- Animation ---
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now();

    // Main Shoe Animation
    mainShoeGroup.position.y = Math.sin(time * 0.002) * 0.1;
    mainShoeGroup.rotation.y = Math.sin(time * 0.001) * 0.1;

    // Background Shoes Animation
    bgShoes.forEach(shoe => {
        shoe.rotation.y += shoe.userData.rotSpeed;
        shoe.position.y += Math.sin(time * shoe.userData.floatSpeed + shoe.userData.floatOffset) * 0.005;
    });

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
