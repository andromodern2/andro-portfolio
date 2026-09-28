const fs = require('fs');
const path = require('path');

const frames = JSON.parse(fs.readFileSync('project-frames.json', 'utf8'));

let html = fs.readFileSync('projects.html', 'utf8');

const scriptStart = html.indexOf('<script>\n    (function () {');
const scriptEnd = html.indexOf('</script>\n\n  <!-- Projects Dynamic Loader');

if (scriptStart !== -1 && scriptEnd !== -1) {
  const newScript = `<script>
    (function () {
      const FRAME_PATHS = ${JSON.stringify(frames)};
      const TOTAL_FRAMES = FRAME_PATHS.length;

      const canvas = document.getElementById('scroll-canvas');
      const ctx = canvas.getContext('2d', { alpha: false });
      const images = new Array(TOTAL_FRAMES);

      let currentFrame = 0;
      let targetFrame = 0;
      let lastDrawnIndex = -1;
      let isFirstFrameDrawn = false;

      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        lastDrawnIndex = -1;
        drawCurrent();
      }

      window.addEventListener('resize', resizeCanvas, { passive: true });
      resizeCanvas();

      function drawImageCover(img) {
        if (!img || !img._loaded) return;
        const cw = canvas.width;
        const ch = canvas.height;
        const iw = img.naturalWidth || 1920;
        const ih = img.naturalHeight || 1080;

        const scale = Math.max(cw / iw, ch / ih);
        const nw = iw * scale;
        const nh = ih * scale;
        const nx = (cw - nw) * 0.5;
        const ny = (ch - nh) * 0.5;

        ctx.drawImage(img, nx, ny, nw, nh);
      }

      function getBestAvailableFrame(index) {
        const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, index));
        if (images[target] && images[target]._loaded) {
          return images[target];
        }

        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = target - offset;
          if (prev >= 0 && images[prev] && images[prev]._loaded) {
            return images[prev];
          }
          const next = target + offset;
          if (next < TOTAL_FRAMES && images[next] && images[next]._loaded) {
            return images[next];
          }
        }
        return null;
      }

      function drawCurrent() {
        const frameIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
        if (frameIndex === lastDrawnIndex) return;

        const img = getBestAvailableFrame(frameIndex);
        if (img) {
          drawImageCover(img);
          lastDrawnIndex = frameIndex;
        }
      }

      function updateScrollProgress() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? Math.max(0, Math.min(1, window.scrollY / maxScroll)) : 0;
        targetFrame = progress * (TOTAL_FRAMES - 1);
      }

      updateScrollProgress();
      currentFrame = targetFrame;

      function preloadImages() {
        for (let i = 0; i < TOTAL_FRAMES; i++) {
          const img = new Image();
          img._loaded = false;

          const onImageLoaded = () => {
            if (img._loaded) return;
            img._loaded = true;
            if (!isFirstFrameDrawn) {
              const target = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
              if (i === target || (i === 0 && !images[target]?._loaded)) {
                isFirstFrameDrawn = true;
                drawImageCover(img);
                lastDrawnIndex = i;
              }
            }
          };

          img.onload = onImageLoaded;
          img.src = FRAME_PATHS[i];

          if (img.complete && img.naturalWidth > 0) {
            onImageLoaded();
          }

          images[i] = img;
        }
      }

      preloadImages();

      fetch('/api/project-frames')
        .then(r => r.json())
        .then(serverFrames => {
          if (Array.isArray(serverFrames) && serverFrames.length > 0 && serverFrames.length !== TOTAL_FRAMES) {
            location.reload();
          }
        })
        .catch(() => {});

      let lenis = null;
      if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          smoothTouch: false,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.5,
        });

        lenis.on('scroll', ({ progress }) => {
          targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, progress * (TOTAL_FRAMES - 1)));
        });
      }

      window.addEventListener('scroll', updateScrollProgress, { passive: true });

      function render(time) {
        if (lenis) lenis.raf(time);

        const delta = targetFrame - currentFrame;
        if (Math.abs(delta) > 0.0005) {
          currentFrame += delta * 0.12;
        } else {
          currentFrame = targetFrame;
        }

        drawCurrent();
        requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
    })();
  </script>`;

  html = html.substring(0, scriptStart) + newScript + html.substring(scriptEnd + 9);
  fs.writeFileSync('projects.html', html, 'utf8');
  console.log('Successfully updated projects.html with ' + frames.length + ' project frames!');
} else {
  console.error('Could not find script block in projects.html');
}
