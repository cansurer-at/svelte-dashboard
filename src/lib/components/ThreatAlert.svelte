<script lang="ts">
  export let type: 'warning' | 'error' | 'info' = 'info';
  export let count: number = 0;
  export let label: string = '';

  const icons = {
    warning: 'Warning',
    error: 'Block',
    info: 'Info'
  };

  const colors = {
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };
</script>

<div class="border-l-4 p-4 rounded-r-lg {colors[type]}">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class="text-2xl">
        {type === 'warning' ? 'Warning' : type === 'error' ? 'Block' : 'Info'}
      </span>
      <div>
        <p class="font-semibold text-lg">{count}</p>
        <p class="text-sm opacity-90">{label}</p>
      </div>
    </div>
    <button class="text-sm underline hover:no-underline opacity-70 hover:opacity-100">
      View →
    </button>
  </div>
</div>