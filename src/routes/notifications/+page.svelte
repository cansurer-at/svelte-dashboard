<script lang="ts">
  import { notifications } from '$lib/notifications'; 
</script>

<svelte:head>
  <title>Notifications</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
      Mark all as read
    </button>
  </div>

  {#if $notifications.length === 0}
    <div class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
      <p class="mt-1 text-sm text-gray-500">You've caught up. Nice work!</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each $notifications as notif}
        <div class="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition">
          <div class="flex-shrink-0 mt-0.5">
            {#if !notif.read}
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            {/if}
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{notif.message}</p>
            <p class="text-xs text-gray-500 mt-0.5">{notif.time}</p>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Ek stil gerekmez, Tailwind kullanıyor */
</style>