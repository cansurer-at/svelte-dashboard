<script lang="ts">
  import type { Device, RiskLevel } from '$lib/types';

  export let device: Device;

  const riskColors: Record<RiskLevel, string> = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    online: 'bg-green-500',
    warning: 'bg-yellow-500',
    offline: 'bg-gray-400'
  };

  $: cpu = Math.round(device.cpu);
  $: memory = Math.round(device.memory);

  $: timeAgo = () => {
    const diff = Date.now() - device.lastSeen;
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? 'now' : `${minutes} min ago`;
  };
</script>

<div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100 h-full flex flex-col">
  <div class="flex justify-between items-start mb-3">
    <div class="flex-1 min-w-0">
      <h3 class="text-base font-semibold text-gray-900 truncate">{device.name}</h3>
      <p class="text-xs text-gray-500 truncate">{device.ip}</p>
    </div>
    <span class="px-2.5 py-1 rounded-full text-xs font-medium {riskColors[device.risk]}">
      {device.risk.toUpperCase()}
    </span>
  </div>

  <div class="space-y-2 text-sm flex-1">
    <div class="flex items-center gap-2">
      <span class="text-gray-600 text-xs">OS:</span>
      <span class="font-medium truncate">{device.os}</span>
    </div>

    <div class="flex items-center justify-between text-xs">
      <div class="flex items-center gap-1.5">
        <div class="w-2 h-2 rounded-full {statusColors[device.status]}"></div>
        <span class="font-medium capitalize">{device.status}</span>
      </div>
      <span class="text-gray-500">• {timeAgo()}</span>
    </div>
  </div>

  <div class="mt-4 space-y-2">
    <div>
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="text-gray-500">CPU</span>
        <span class="font-medium">{cpu}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div
          class="h-1.5 rounded-full transition-all duration-500"
          class:bg-green-500={cpu < 70}
          class:bg-yellow-500={cpu >= 70 && cpu < 90}
          class:bg-red-500={cpu >= 90}
          style="width: {cpu}%"
        ></div>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between text-xs mb-1">
        <span class="text-gray-500">RAM</span>
        <span class="font-medium">{memory}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div
          class="h-1.5 rounded-full transition-all duration-500"
          class:bg-green-500={memory < 70}
          class:bg-yellow-500={memory >= 70 && memory < 90}
          class:bg-red-500={memory >= 90}
          style="width: {memory}%"
        ></div>
      </div>
    </div>
  </div>
</div>