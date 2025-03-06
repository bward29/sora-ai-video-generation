// Lightning storm function (updated to work with SVG bolts)
function triggerLightningStorm() {
    // Activate the storm container
    const stormContainer = document.querySelector('.lightning-container');
    stormContainer.classList.add('storm-active');

    // Activate storm overlay
    const stormOverlay = document.querySelector('.storm-overlay');
    stormOverlay.classList.add('active');

    // Trigger lightning flashes with random timing
    const lightnings = document.querySelectorAll('.lightning-bolt');

    // Initial flash for all lightning bolts
    lightnings.forEach(lightning => {
        lightning.classList.add('lightning-flash');
    });

    // Continue random flashes for a few seconds
    let flashCount = 0;
    const maxFlashes = 7;

    function randomFlash() {
        if (flashCount >= maxFlashes) {
            // End the storm after maxFlashes
            setTimeout(() => {
                stormContainer.classList.remove('storm-active');
                stormOverlay.classList.remove('active');
                lightnings.forEach(lightning => {
                    lightning.classList.remove('lightning-flash');
                });
            }, 800);
            return;
        }

        // Select 1-2 random lightning bolts to flash
        const numBolts = Math.random() > 0.5 ? 2 : 1;

        for (let i = 0; i < numBolts; i++) {
            const randomIndex = Math.floor(Math.random() * lightnings.length);
            const bolt = lightnings[randomIndex];

            bolt.classList.remove('lightning-flash');

            // Trigger reflow to restart animation
            void bolt.offsetWidth;

            bolt.classList.add('lightning-flash');
        }

        flashCount++;

        // Schedule next flash with random timing
        const nextFlashTime = 200 + Math.random() * 600;
        setTimeout(randomFlash, nextFlashTime);
    }

    // Start random flashes after initial synchronous flash
    setTimeout(randomFlash, 300);
}