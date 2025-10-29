<script lang="ts">
  import ConnectionGraph from '$lib/components/ConnectionGraph.svelte';
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Process Connections</h1>
      <p class="text-sm text-gray-600 mt-1">Real-time process-to-process communication map</p>
    </div>
    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      Refresh
    </button>
  </div>

  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <ConnectionGraph />
  </div>
</div>