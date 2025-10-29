<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let canvas: HTMLCanvasElement;
  let data = Array(60).fill(0);

  function getRandomData() {
    return Math.random() * 80 + 20;
  }

  onMount(() => {
    if (!browser) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let gradient = ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    const draw = () => {
      data = [...data.slice(1), getRandomData()];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      data.forEach((val, i) => {
        const x = (i / data.length) * canvas.width;
        const y = canvas.height - (val / 100) * canvas.height;
        ctx.lineTo(x, y);
      });
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - (data[0] / 100) * canvas.height);
      data.forEach((val, i) => {
        const x = (i / data.length) * canvas.width;
        const y = canvas.height - (val / 100) * canvas.height;
        ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    draw();
    const interval = setInterval(draw, 1000);
    return () => clearInterval(interval);
  });
</script>

<canvas bind:this={canvas} width="800" height="200" class="w-full h-48"></canvas>