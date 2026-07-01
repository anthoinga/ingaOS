<script lang="ts">
  import bookmarks from '@/data/bookmarks.json'
  import type { AppProps } from '@/types'

  let { onClose: _onClose }: AppProps = $props()

  let active = $state<string | null>(null)
  let selected = $derived(bookmarks.find((b) => b.id === active))
</script>

<div class="h-full flex flex-col">
  <!-- Bookmark bar -->
  <div class="flex gap-2 px-4 py-2 border-b border-[var(--bg-raised)] overflow-x-auto shrink-0 bg-[var(--bg-surface)]">
    {#each bookmarks as b (b.id)}
      <button
        onclick={() => active = b.id}
        class="text-xs px-3 py-1.5 rounded whitespace-nowrap transition-colors font-mono {active === b.id
          ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
          : 'bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}"
      >
        {b.label}
      </button>
    {/each}
  </div>

  <!-- Iframe -->
  <div class="flex-1 relative bg-[var(--bg-primary)]">
    {#if selected}
      <iframe
        src={selected.url}
        class="w-full h-full border-0"
        title={selected.label}
        sandbox="allow-scripts allow-forms"
      ></iframe>
    {:else}
      <div class="h-full flex items-center justify-center">
        <p class="text-sm text-[var(--text-muted)] font-mono">Select a bookmark above</p>
      </div>
    {/if}
  </div>
</div>
