<script lang="ts">
  import { page } from '$app/stores';
  import type { MenuItem } from '$lib/types';

  const menu: MenuItem[] = [
    { name: 'Dashboard', path: '/', icon: '' },
    { name: 'Devices', path: '/devices', icon: '' },
    { name: 'Connections', path: '/connections', icon: '' },
    { name: 'Analytics', path: '/analytics', icon: '' },
    { name: 'Settings', path: '/settings', icon: '' }
  ];

  $: activePath = $page.url.pathname;
</script>

<aside class="w-64 bg-gray-900 text-white p-6 flex flex-col h-full">
  <div class="flex items-center gap-3 mb-10">
    <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg"></div>
    <h1 class="text-2xl font-bold tracking-tight">Nexufend</h1>
  </div>

  <nav class="flex-1 space-y-1">
    {#each menu as item}
      <a
        href={item.path}
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
               {activePath === item.path 
                 ? 'bg-blue-600 text-white shadow-lg' 
                 : 'hover:bg-gray-800 text-gray-300'}"
      >
        <span class="text-xl">{item.icon}</span>
        <span class="font-medium">{item.name}</span>
      </a>
    {/each}
  </nav>
</aside>