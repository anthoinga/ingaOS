<script lang="ts">
  import type { AppProps } from '@/types'
  import { t, changeLanguage, getLanguage } from '@/lib/i18n.svelte'

  let { item }: AppProps = $props()
</script>

{#if item?.id === 'settings-about'}
  <div class="h-full overflow-y-auto px-6 py-6 max-w-md font-mono text-sm leading-relaxed text-[var(--text-primary)]">
    <h2 class="text-lg font-display font-medium text-[var(--text-primary)] mb-6">
      About
    </h2>
    <p class="whitespace-pre-wrap">
    Interfaces dictate how we move through the digital world. Modern software has largely abandoned that responsibility in favor of administrative bloat.

This app interface is a functional study in structural minimalism, built as a direct homage to Yasuhiro Yamanaka's interface design philosophy. When Yamanaka engineered Sony's XrossMediaBar, he solved a complex information architecture problem through radical distillation. By intersecting two independent axes and anchoring the focal point to the center of the screen, he eliminated the cognitive friction of scanning a visual grid. Navigation became instinct. The interface disappeared.

ingaOS is my personal love letter to the legend who built one of the most prominent interface experience of my childhood.
    </p>
  </div>
{:else}
  <div class="h-full overflow-y-auto px-6 py-6 max-w-md">
    <h2 class="text-lg font-display font-medium text-[var(--text-primary)] mb-6">
      {t('settings.title')}
    </h2>

    <section>
      <h3 class="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
        {t('settings.language')}
      </h3>
      <div class="flex gap-2">
        {#each [
          { code: 'en', label: t('settings.lang_en') },
          { code: 'es', label: t('settings.lang_es') },
        ] as { code, label } (code)}
          <button
            onclick={() => changeLanguage(code)}
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {getLanguage().startsWith(code)
              ? 'bg-[var(--accent)] text-[var(--bg-primary)]'
              : 'bg-[var(--bg-raised)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'}"
          >
            {label}
          </button>
        {/each}
      </div>
    </section>
  </div>
{/if}
