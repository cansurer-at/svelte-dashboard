<script lang="ts">
  import type { RiskLevel } from '$lib/types';

  export let x: number;
  export let y: number;
  export let name: string;
  export let pid: number;
  export let risk: RiskLevel = 'low';
  export let isActive: boolean = false;

  const riskColors = {
    low: 'fill-green-500',
    medium: 'fill-yellow-500',
    high: 'fill-red-500'
  };
</script>

<g class="cursor-pointer group" transform="translate({x},{y})">
  <circle
    r="28"
    class="{riskColors[risk]} {isActive ? 'animate-pulse' : ''} transition-all duration-300"
    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))"
  />
  
  <circle r="12" cx="20" cy="-20" fill="#1f2937" />
  <text x="20" y="-16" class="text-xs font-bold text-white fill-white" text-anchor="middle">{pid}</text>

  <foreignObject x="-80" y="-80" width="160" height="80" class="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
    <div class="bg-gray-900 text-white p-3 rounded-lg shadow-xl text-xs">
      <div class="font-semibold">{name}</div>
      <div class="text-gray-400">PID: {pid}</div>
      <div class="flex items-center gap-1 mt-1">
        <div class="w-2 h-2 rounded-full {riskColors[risk].replace('fill-', 'bg-')}"></div>
        <span class="capitalize">{risk} Risk</span>
      </div>
    </div>
  </foreignObject>

  <text x="0" y="38" class="text-xs font-medium text-gray-700 fill-gray-700" text-anchor="middle">
    {name.split('/').pop()}
  </text>
</g>