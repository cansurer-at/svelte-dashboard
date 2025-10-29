<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Bildirim tipi
  interface Notification {
    id: number;
    message: string;
    time: string;
    read: boolean;
  }

  // Bildirim verileri
  let notifications: Notification[] = [
    { id: 1, message: 'New login from Chrome on Windows', time: '2 mins ago', read: false },
    { id: 2, message: 'Backup completed successfully', time: '1 hour ago', read: false },
    { id: 3, message: 'Server CPU usage above 90%', time: '3 hours ago', read: true },
    { id: 4, message: 'User account updated', time: 'Yesterday', read: true },
  ];

  // Reactive: Okunmamış sayısı
  $: unreadCount = notifications.filter(n => !n.read).length;

  let time = '';
  let profileOpen = false;
  let notifOpen = false;

  // Saat
  onMount(() => {
    const update = () => {
      time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  });

  // Dropdown Aç/Kapa
  function toggleProfile(e: MouseEvent) {
    e.stopPropagation();
    profileOpen = !profileOpen;
    if (notifOpen) notifOpen = false;
  }

  function toggleNotifications(e: MouseEvent) {
    e.stopPropagation();
    notifOpen = !notifOpen;
    if (profileOpen) profileOpen = false;
  }

  // Dışarı tıklayınca kapan
  function clickOutside(e: MouseEvent) {
    const t = e.target as HTMLElement;
    if (
      (profileOpen && !t.closest('.profile-dropdown')) ||
      (notifOpen && !t.closest('.notif-dropdown'))
    ) {
      profileOpen = false;
      notifOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', clickOutside);
    return () => document.removeEventListener('click', clickOutside);
  });

  // Profil
  function goToProfile() { profileOpen = false; goto('/profile'); }
  function goToSettings() { profileOpen = false; goto('/settings'); }
  function signOut() { profileOpen = false; goto('/login'); }

  // Bildirim İşlemleri
  function markAsRead(id: number) {
    notifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
  }

  function deleteNotification(id: number) {
    notifications = notifications.filter(n => n.id !== id);
  }

  function markAllAsRead() {
    notifications = notifications.map(n => ({ ...n, read: true }));
  }

  function goToAllNotifications() {
    notifOpen = false;
    goto('/notifications');
  }
</script>

<header class="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
  <!-- LEFT: Status + Time -->
  <div class="flex items-center gap-4 sm:gap-6 text-sm">
    <div class="flex items-center gap-2">
      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span class="font-medium text-green-600">All Systems Operational</span>
    </div>
    <span class="hidden sm:inline text-gray-400">|</span>
    <span class="font-mono text-gray-600">{time}</span>
  </div>

  <!-- RIGHT: Notifications + Profile -->
  <div class="flex items-center gap-3">

    <!-- Notifications -->
    <div class="relative notif-dropdown">
      <button
        on:click={toggleNotifications}
        class="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="Notifications"
      >
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {#if unreadCount > 0}
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        {/if}
      </button>

      <!-- Dropdown -->
      {#if notifOpen}
        <div class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <!-- Header -->
          <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 class="font-semibold text-gray-900">Notifications</h3>
            <div class="flex items-center gap-2">
              {#if unreadCount > 0}
                <button
                  on:click={markAllAsRead}
                  class="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all as read
                </button>
              {/if}
            </div>
          </div>

          <!-- Liste -->
          <div class="max-h-96 overflow-y-auto">
            {#if notifications.length === 0}
              <div class="px-4 py-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            {:else}
              {#each notifications as n}
                <div
                  class="px-4 py-3 hover:bg-gray-50 transition flex items-start gap-3 border-b border-gray-50 last:border-0"
                  class:bg-gray-50={!n.read}
                >
                  <!-- Nokta -->
                  <div class="flex-shrink-0 mt-0.5">
                    {#if !n.read}
                      <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {/if}
                  </div>

                  <!-- İçerik -->
                  <div class="flex-1 min-w-0">
                    <button
                      on:click={() => markAsRead(n.id)}
                      class="text-left w-full"
                    >
                      <p class="text-sm text-gray-900 truncate">{n.message}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{n.time}</p>
                    </button>
                  </div>

                  <!-- Sil Butonu -->
                  <button
                    on:click|stopPropagation={() => deleteNotification(n.id)}
                    class="text-gray-400 hover:text-red-600 transition"
                    aria-label="Delete notification"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              {/each}
            {/if}
          </div>

          <!-- Footer -->
          <div class="px-4 py-2 border-t border-gray-100">
            <button
              on:click={goToAllNotifications}
              class="w-full text-sm text-blue-600 hover:text-blue-700 font-medium text-left transition"
            >
              View all notifications
            </button>
          </div>
        </div>
      {/if}
    </div>

    <!-- Profile -->
    <div class="relative profile-dropdown">
      <button
        on:click={toggleProfile}
        class="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        aria-label="User menu"
      >
        <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          AD
        </div>
        <div class="hidden sm:flex items-center gap-1 text-sm">
          <span class="font-medium text-gray-900">Admin User</span>
          <svg class="w-4 h-4 text-gray-500 transition-transform {profileOpen ? 'rotate-180' : ''}"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {#if profileOpen}
        <div class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <button on:click={goToProfile} class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Your Profile
          </button>

          <button on:click={goToSettings} class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition text-left">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>

          <hr class="my-1 border-gray-200">

          <button on:click={signOut} class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-6 0v-1m6 0H9" />
            </svg>
            Sign Out
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>