<script lang="ts">
  import DeviceCard from '$lib/components/DeviceCard.svelte';
  import DeviceFilters from '$lib/components/DeviceFilters.svelte';
  import type { Device } from '$lib/types';
  import { onMount } from 'svelte';

  let search = '';
  let statusFilter: 'all' | 'online' | 'offline' | 'warning' = 'all';
  let riskFilter: 'all' | 'low' | 'medium' | 'high' = 'all';

  let devices: Device[] = [
    { id: 1, name: 'web-server-01', ip: '192.168.1.10', os: 'Ubuntu 22.04', status: 'online', risk: 'low', cpu: 35, memory: 48, lastSeen: Date.now() - 30000 },
    { id: 2, name: 'db-prod-01', ip: '192.168.1.20', os: 'CentOS 7', status: 'online', risk: 'high', cpu: 82, memory: 91, lastSeen: Date.now() - 10000 },
    { id: 3, name: 'laptop-john', ip: '192.168.1.55', os: 'macOS Ventura', status: 'warning', risk: 'medium', cpu: 68, memory: 72, lastSeen: Date.now() - 120000 },
    { id: 4, name: 'router-main', ip: '192.168.1.1', os: 'OpenWRT', status: 'online', risk: 'low', cpu: 12, memory: 28, lastSeen: Date.now() - 5000 },
    { id: 5, name: 'camera-hallway', ip: '192.168.1.88', os: 'Embedded Linux', status: 'offline', risk: 'low', cpu: 0, memory: 0, lastSeen: Date.now() - 3600000 }
  ];

  onMount(() => {
    const interval = setInterval(() => {
      devices = devices.map(d => ({
        ...d,
        cpu: Math.round(Math.max(0, Math.min(100, d.cpu + (Math.random() - 0.5) * 5))),
        memory: Math.round(Math.max(0, Math.min(100, d.memory + (Math.random() - 0.5) * 4))),
        lastSeen: Date.now(),
        status: d.status === 'offline' ? 'offline' : Math.random() > 0.98 ? 'warning' : 'online'
      }));
    }, 5000);
    return () => clearInterval(interval);
  });

  $: filteredDevices = devices.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.ip.includes(search);
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || d.risk === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
  });
</script>

<div class="space-y-6">
  <!-- HEADER -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Managed Devices</h1>
      <p class="text-sm text-gray-600 mt-1">{filteredDevices.length} active devices</p>
    </div>
    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-medium">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Add Device
    </button>
  </div>

  <!-- FİLTRELER (RESPONSIVE) -->
  <div class="block">
    <DeviceFilters bind:search bind:statusFilter bind:riskFilter />
  </div>

  <!-- CİHAZ KARTLARI (FULL RESPONSIVE) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {#each filteredDevices as device}
      <DeviceCard {device} />
    {/each}
  </div>

  <!-- BOŞ DURUM -->
  {#if filteredDevices.length === 0}
    <div class="text-center py-16">
      <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4"></div>
      <p class="text-gray-500 text-lg">No devices match your search criteria.</p>
      <p class="text-sm text-gray-400 mt-2">Try adjusting your filters.</p>
    </div>
  {/if}
</div>