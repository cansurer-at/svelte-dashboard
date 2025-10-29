<script lang="ts">
  import { onMount } from 'svelte';

  // Form state
  let companyName = 'Nexufend Inc.';
  let adminEmail = 'admin@nexufend.com';
  let timezone = 'Europe/Istanbul';
  let dateFormat = 'DD/MM/YYYY';
  let timeFormat = '24h';

  let emailAlerts = true;
  let pushAlerts = false;
  let smsAlerts = false;
  let criticalOnly = false;

  let mfaEnabled = true;
  let sessionTimeout = 30;
  let passwordPolicy = 'strong';

  let darkMode = false;

  let saveStatus = '';
  let isSaving = false;

  // Sadece client-side'da çalışır
  onMount(() => {
    const saved = localStorage.getItem('nexufend-settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        companyName = data.companyName ?? companyName;
        adminEmail = data.adminEmail ?? adminEmail;
        timezone = data.timezone ?? timezone;
        dateFormat = data.dateFormat ?? dateFormat;
        timeFormat = data.timeFormat ?? timeFormat;
        emailAlerts = data.emailAlerts ?? emailAlerts;
        pushAlerts = data.pushAlerts ?? pushAlerts;
        smsAlerts = data.smsAlerts ?? smsAlerts;
        criticalOnly = data.criticalOnly ?? criticalOnly;
        mfaEnabled = data.mfaEnabled ?? mfaEnabled;
        sessionTimeout = data.sessionTimeout ?? sessionTimeout;
        passwordPolicy = data.passwordPolicy ?? passwordPolicy;
        darkMode = data.darkMode ?? darkMode;
      } catch (e) {
        console.warn('Failed to load settings:', e);
      }
    }

    // Auto-save on change
    $: {
      const settings = {
        companyName, adminEmail, timezone, dateFormat, timeFormat,
        emailAlerts, pushAlerts, smsAlerts, criticalOnly,
        mfaEnabled, sessionTimeout, passwordPolicy, darkMode
      };
      localStorage.setItem('nexufend-settings', JSON.stringify(settings));
    }
  });

  async function saveSettings() {
    isSaving = true;
    saveStatus = 'saving';
    await new Promise(r => setTimeout(r, 1200));
    saveStatus = 'success';
    isSaving = false;
    setTimeout(() => saveStatus = '', 3000);
  }
</script>

<svelte:head>
  <title>Settings | Nexufend</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
      <p class="text-sm text-gray-600 mt-1">Manage your organization, notifications, and security</p>
    </div>
    <button
      on:click={saveSettings}
      disabled={isSaving}
      class="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2"
    >
      {#if isSaving}
        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8v4h-4a4 4 0 00-4 4h4z" class="opacity-75"/></svg>
        Saving...
      {:else if saveStatus === 'success'}
        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
        Saved!
      {:else}
        Save Changes
      {/if}
    </button>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Settings -->
    <div class="lg:col-span-2 space-y-6">

      <!-- Organization -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          Organization
        </h2>
        <div class="space-y-4">
          <div>
            <label for="company" class="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
            <input id="company" bind:value={companyName} type="text" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Admin Email</label>
            <input id="email" bind:value={adminEmail} type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="timezone" class="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
              <select id="timezone" bind:value={timezone} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>Europe/Istanbul</option>
                <option>UTC</option>
                <option>America/New_York</option>
              </select>
            </div>
            <div>
              <label for="dateformat" class="block text-sm font-medium text-gray-700 mb-1.5">Date Format</label>
              <select id="dateformat" bind:value={dateFormat} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb- |
5 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          Notifications
        </h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="font-medium text-gray-900">Email Alerts</p>
              <p class="text-sm text-gray-500">Receive alerts via email</p>
            </div>
            <input type="checkbox" bind:checked={emailAlerts} class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <!-- Diğer checkbox'lar aynı -->
        </div>
      </div>

      <!-- Security -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          Security
        </h2>
        <div class="space-y-4">
          <label class="flex items-center justify-between cursor-pointer">
            <div>
              <p class="font-medium text-gray-900">Multi-Factor Authentication (MFA)</p>
              <p class="text-sm text-gray-500">Require MFA for all users</p>
            </div>
            <input type="checkbox" bind:checked={mfaEnabled} class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <div>
            <label for="timeout" class="block text-sm font-medium text-gray-700 mb-1.5">Session Timeout (minutes)</label>
            <input id="timeout" bind:value={sessionTimeout} type="number" min="5" max="120" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label for="policy" class="block text-sm font-medium text-gray-700 mb-1.5">Password Policy</label>
            <select id="policy" bind:value={passwordPolicy} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="weak">Weak</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
        <label class="flex items-center justify-between cursor-pointer">
          <div>
            <p class="font-medium text-gray-900">Dark Mode</p>
            <p class="text-sm text-gray-500">Toggle dark theme</p>
          </div>
          <input type="checkbox" bind:checked={darkMode} class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
        </label>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="space-y-3">
          <button class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
            Export Configuration
          </button>
          <!-- Diğer butonlar -->
        </div>
      </div>
    </div>
  </div>
</div>