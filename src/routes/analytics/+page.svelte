<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart } from 'chart.js/auto';
  import { connections, anomalies, addRandomAnomaly } from '$lib/analytics';
  import { notifications } from '$lib/notifications';

  // Canvas references
  let trafficCanvas: HTMLCanvasElement;
  let riskCanvas: HTMLCanvasElement;
  let anomalyCanvas: HTMLCanvasElement;

  let trafficChart: Chart;
  let riskChart: Chart;
  let anomalyChart: Chart;

  // Reactive statistics
  $: totalConnections = $connections.length;
  $: criticalAnomalies = $anomalies.filter(a => a.severity === 'high').length;
  $: activeDevices = [...new Set($connections.map(c => c.from.split(':')[0]))].length;

  $: riskBreakdown = $connections.reduce((acc, c) => {
    acc[c.risk]++;
    return acc;
  }, { low: 0, medium: 0, high: 0 });

  // Initialize charts and real-time updates
  onMount(() => {
    trafficChart = createTrafficChart();
    riskChart = createRiskChart();
    anomalyChart = createAnomalyChart();

    // Simulate live data every 4 seconds
    const interval = setInterval(() => {
      addRandomAnomaly();
      updateTrafficChart();
      updateRiskChart();
    }, 4000);

    return () => {
      clearInterval(interval);
      trafficChart?.destroy();
      riskChart?.destroy();
      anomalyChart?.destroy();
    };
  });

  // Create Network Traffic Line Chart
  function createTrafficChart(): Chart {
    return new Chart(trafficCanvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Network Traffic (MB/s)',
          data: [],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { display: true, grid: { display: false } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }
        }
      }
    });
  }

  // Create Risk Distribution Donut Chart
  function createRiskChart(): Chart {
    return new Chart(riskCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          borderWidth: 0,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.raw} connections` } }
        },
        cutout: '65%'
      }
    });
  }

  // Create Anomaly Timeline Bar Chart
  function createAnomalyChart(): Chart {
    return new Chart(anomalyCanvas, {
      type: 'bar',
      data: {
        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        datasets: [{
          label: 'Anomalies',
          data: [2, 5, 8, 12, 7, 3],
          backgroundColor: '#EF4444',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { beginAtZero: true, ticks: { stepSize: 2 } }
        }
      }
    });
  }

  // Update Traffic Chart with new data point
  function updateTrafficChart() {
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const value = Math.random() * 150 + 20;

    trafficChart.data.labels.push(time);
    trafficChart.data.datasets[0].data.push(value);

    if (trafficChart.data.labels.length > 12) {
      trafficChart.data.labels.shift();
      trafficChart.data.datasets[0].data.shift();
    }

    trafficChart.update('quiet');
  }

  // Update Risk Donut Chart
  function updateRiskChart() {
    riskChart.data.datasets[0].data = [
      riskBreakdown.low,
      riskBreakdown.medium,
      riskBreakdown.high
    ];
    riskChart.update('quiet');
  }

  // Initialize risk chart on first render
  $: if (riskChart) updateRiskChart();
</script>

<svelte:head>
  <title>Analytics | Nexufend</title>
  <meta name="description" content="Real-time network security analytics dashboard" />
</svelte:head>

<div class="space-y-6">
  <!-- Page Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Security Analytics</h1>
      <p class="text-sm text-gray-600 mt-1">Real-time insights into network behavior and threats</p>
    </div>
    <button class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m-3-3h6m5-7v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2z" />
      </svg>
      Export Report
    </button>
  </div>

  <!-- Summary Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Connections</p>
          <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{totalConnections}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Critical Anomalies</p>
          <p class="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{criticalAnomalies}</p>
        </div>
        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Active Devices</p>
          <p class="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{activeDevices}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Avg. Risk Score</p>
          <p class="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
            {#if riskBreakdown.high > 5}High{:else if riskBreakdown.medium > 10}Medium{:else}Low{/if}
          </p>
        </div>
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Charts Grid -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Network Traffic -->
    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Network Traffic</h2>
        <span class="text-xs text-green-600 font-medium">LIVE</span>
      </div>
      <div class="h-64 sm:h-80">
        <canvas bind:this={trafficCanvas}></canvas>
      </div>
    </div>

    <!-- Risk Distribution -->
    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h2>
      <div class="h-64 sm:h-80 flex items-center justify-center">
        <canvas bind:this={riskCanvas}></canvas>
      </div>
    </div>
  </div>

  <!-- Anomaly Timeline + Recent Alerts -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Anomaly Timeline -->
    <div class="lg:col-span-2 bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Anomaly Timeline (24h)</h2>
      <div class="h-64">
        <canvas bind:this={anomalyCanvas}></canvas>
      </div>
    </div>

    <!-- Recent Alerts -->
    <div class="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Alerts</h2>
        <a href="/notifications" class="text-sm text-blue-600 hover:underline">View all</a>
      </div>
      <div class="space-y-3 max-h-64 overflow-y-auto">
        {#each $anomalies.slice(0, 5) as alert}
          <div class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div class="w-2 h-2 rounded-full mt-1 {alert.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}"></div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 truncate">{alert.message}</p>
              <p class="text-xs text-gray-500">{alert.time}</p>
            </div>
          </div>
        {/each}
        {#if $anomalies.length === 0}
          <p class="text-center text-sm text-gray-500 py-8">No recent alerts</p>
        {/if}
      </div>
    </div>
  </div>
</div>