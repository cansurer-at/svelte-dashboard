<script lang="ts">
  import "../app.css"; 
  import Sidebar from '$lib/components/Sidebar.svelte';
  import Topbar from '$lib/components/Topbar.svelte';
</script>

<div class="flex h-screen bg-gray-50">
  <Sidebar />
  <div class="flex-1 flex flex-col">
    <Topbar />
    <main class="flex-1 overflow-auto p-6">
      <slot />
    </main>
  </div>
</div>
