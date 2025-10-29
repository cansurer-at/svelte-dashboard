<script lang="ts">
  import { onMount } from 'svelte';
  import ProcessNode from './ProcessNode.svelte';
  import type { ProcessNode as Node, Connection } from '$lib/types';

  let width = 800;
  let height = 600;

  let nodes: Node[] = [
    { id: 1, name: '/usr/bin/ssh', pid: 1234, x: 150, y: 200, risk: 'high', isActive: true },
    { id: 2, name: '/bin/bash', pid: 5678, x: 400, y: 100, risk: 'low', isActive: false },
    { id: 3, name: '/usr/sbin/apache2', pid: 9012, x: 400, y: 300, risk: 'medium', isActive: true },
    { id: 4, name: '/opt/mysql/bin/mysqld', pid: 3456, x: 650, y: 200, risk: 'low', isActive: false }
  ];

  let connections: Connection[] = [
    { from: 1, to: 2, threat: true },
    { from: 2, to: 3, threat: false },
    { from: 3, to: 4, threat: false },
    { from: 1, to: 4, threat: true }
  ];

  onMount(() => {
    const interval = setInterval(() => {
      nodes = nodes.map(n => ({
        ...n,
        isActive: Math.random() > 0.7
      }));
    }, 2000);
    return () => clearInterval(interval);
  });
</script>

<svg {width} {height} class="w-full h-full border border-gray-200 rounded-lg bg-gray-50">
  {#each connections as conn}
    {@const fromNode = nodes.find(n => n.id === conn.from)}
    {@const toNode = nodes.find(n => n.id === conn.to)}
    {#if fromNode && toNode}
      <line
        x1={fromNode.x} y1={fromNode.y}
        x2={toNode.x} y2={toNode.y}
        stroke={conn.threat ? '#ef4444' : '#94a3b8'}
        stroke-width={conn.threat ? 3 : 2}
        stroke-dasharray={conn.threat ? '6,6' : 'none'}
        class="transition-all duration-500 {conn.threat ? 'animate-pulse' : ''}"
      />
      {#if conn.threat}
        <circle r="6" cx={fromNode.x} cy={fromNode.y} fill="#ef4444" class="animate-ping" />
      {/if}
    {/if}
  {/each}

  {#each nodes as node}
    <ProcessNode {...node} />
  {/each}
</svg>