<script lang="ts">
  export let search = '';
  export let statusFilter: 'all' | 'online' | 'offline' | 'warning' = 'all';
  export let riskFilter: 'all' | 'low' | 'medium' | 'high' = 'all';

  const statusOptions = [
    { value: 'all', label: 'All', icon: 'Circle' },
    { value: 'online', label: 'Online', icon: 'CheckCircle' },
    { value: 'warning', label: 'Warning', icon: 'AlertCircle' },
    { value: 'offline', label: 'Offline', icon: 'XCircle' }
  ];

  const riskOptions = [
    { value: 'all', label: 'All' },
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];
</script>

<div class="bg-white rounded-xl shadow-sm p-4 space-y-4">
  <!-- SEARCH -->
  <input
    type="text"
    placeholder="Search devices..."
    bind:value={search}
    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
  />

  <!-- FILTERS (MOBILE: COLUMN, DESKTOP: ROW) -->
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <!-- STATUS -->
    <div>
      <p class="text-xs font-medium text-gray-700 mb-2">Status</p>
      <div class="flex flex-wrap gap-2">
        {#each statusOptions as opt}
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                   {statusFilter === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
            on:click={() => statusFilter = opt.value}
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- RISK -->
    <div>
      <p class="text-xs font-medium text-gray-700 mb-2">Risk</p>
      <div class="flex flex-wrap gap-2">
        {#each riskOptions as opt}
          <button
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                   {riskFilter === opt.value ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
            on:click={() => riskFilter = opt.value}
          >
            {#if opt.color}
              <div class="w-2.5 h-2.5 rounded-full {opt.color}"></div>
            {/if}
            <span>{opt.label}</span>
          </button>
        {/each}
      </div>
    </div>
  </div>
</div>