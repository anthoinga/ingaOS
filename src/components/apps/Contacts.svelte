<script lang="ts">
  import contacts from '@/data/contacts.json'
  import type { AppProps } from '@/types'

  let { onClose: _onClose }: AppProps = $props()
</script>

<div class="h-full overflow-y-auto px-6 py-6 max-w-sm">
  <h2 class="text-lg font-display font-medium text-[var(--text-primary)] mb-4">Contacts</h2>
  <div class="flex flex-col gap-2">
    {#each contacts as c (c.id)}
      <a
        href={c.url}
        target={c.url.startsWith('mailto') ? undefined : '_blank'}
        rel="noopener noreferrer"
        class="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] transition-colors"
      >
        <span class="text-2xl">{c.icon}</span>
        <div>
          <p class="text-sm font-medium text-[var(--text-primary)]">{c.label}</p>
          <p class="text-xs text-[var(--text-muted)]">{c.value}</p>
        </div>
      </a>
    {/each}
  </div>
</div>
