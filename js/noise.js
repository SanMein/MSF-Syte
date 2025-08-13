document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing noise effect...');

    const noiseOverlay = document.getElementById('noise-overlay');

    if (!noiseOverlay) {
        console.error('Noise overlay element not found. Please add <div id="noise-overlay"></div> to your HTML.');
        return;
    }

    function createNoiseEffect() {
        const size = 100;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(0, 0, 0, 0)';
        ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const alpha = Math.random() * 0.1;
            ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
            ctx.fillRect(x, y, 1, 1);
        }

        noiseOverlay.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`;
    }

    createNoiseEffect();
});