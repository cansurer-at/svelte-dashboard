<script lang="ts">
  import { onMount } from 'svelte';
  import type { TimeSeriesData } from '$lib/types';

  export let title: string = 'Network Traffic';
  export let threshold: number = 80;

  let canvas: HTMLCanvasElement;
  let data: TimeSeriesData[] = [];

  onMount(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      data = [...data.slice(-59), { timestamp: now, value: Math.random() * 100 }];
      draw();
    }, 1000);

    const draw = () => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(0, 0, width, height);

      // Threshold line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(0, height - (threshold / 100) * height);
      ctx.lineTo(width, height - (threshold / 100) * height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Data line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      data.forEach((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (d.value / 100) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    draw();
    return () => clearInterval(interval);
  });
</script>

<div class="bg-white rounded-xl shadow-sm p-6">
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-lg font-semibold">{title}</h3>
    <span class="text-sm text-gray-500">Mbps</span>
  </div>
  <canvas bind:this={canvas} width="800" height="200" class="w-full h-48"></canvas>
</div>