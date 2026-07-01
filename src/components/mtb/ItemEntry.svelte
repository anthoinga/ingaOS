<script lang="ts">
  import { cn } from '@/lib/utils'
  import FileTypeSymbol from './FileTypeSymbol.svelte'
  import type { MTBItem } from '@/types'
  import { t } from '@/lib/i18n.svelte'

  interface Props {
    item: MTBItem
    isActive: boolean
    onclick: () => void
    opacity: number
    scale: number
    subOpacity: number
  }

  let {
    item,
    isActive,
    onclick,
    opacity,
    scale,
    subOpacity,
  }: Props = $props()
</script>

<button
  {onclick}
  class={cn(
    'w-full flex items-center gap-3 px-4 sm:gap-6 sm:px-8 h-[72px] sm:h-[92px] rounded-3xl text-left transition-colors duration-100 shrink-0',
    'focus:outline-none select-none',
    isActive ? 'glass-active text-[var(--text-primary)]' : 'text-[var(--text-muted)]'
  )}
  style:opacity={opacity}
  style:transform="scale({scale})"
  style:transform-origin="left center"
>
  <FileTypeSymbol {item} />
  {#if item.thumbnail}
    <img
      src={item.thumbnail}
      alt=""
      class="w-12 h-12 sm:w-16 sm:h-16 rounded object-cover shrink-0"
    />
  {/if}
  <div class="min-w-0 flex-1">
    <p
      class={cn("font-medium font-sans truncate", isActive && "active-text-glow")}
      style:font-size="var(--text-ui-base)"
    >
      {item.labelKey ? t(item.labelKey) : item.label}
    </p>
    {#if item.subtitle}
      <p
        class="text-[var(--text-muted)] truncate"
        style:opacity={subOpacity}
        style:font-size="var(--text-ui-sm)"
      >
        {item.subtitle}
      </p>
    {/if}
  </div>

  <span
    class={cn(
      'ml-auto text-white text-xs sm:text-base transition-all duration-200',
      isActive ? 'pointer-events-auto' : 'pointer-events-none'
    )}
    class:active={isActive}
    style:opacity={isActive ? subOpacity : 0}
  >
    ▶
  </span>
</button>

<style>
  span.active {
    animation: bounceRight 0.6s ease-in-out infinite alternate;
  }
  @keyframes bounceRight {
    0% { transform: translateX(0); }
    100% { transform: translateX(4px); }
  }
</style>
