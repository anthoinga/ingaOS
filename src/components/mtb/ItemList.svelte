<script lang="ts">
  import { untrack } from 'svelte'
  import { tweened } from 'svelte/motion'
  import { fly } from 'svelte/transition'
  import ItemEntry from './ItemEntry.svelte'
  import type { Category } from '@/types'
  import { isMobile } from '@/hooks/isMobile.svelte'
  import { t } from '@/lib/i18n.svelte'
  import { cubicBezier } from '@/lib/utils'

  // Matches the pre-migration Motion `animate(scrollY, target, { duration: 0.3, ease: [0.25, 1, 0.5, 1] })`
  const EASE = cubicBezier(0.25, 1, 0.5, 1)

  interface Props {
    category: Category
    activeItemIndex: number
    onSelectItem: (index: number) => void
    onOpenItem: (index: number) => void
  }

  let {
    category,
    activeItemIndex,
    onSelectItem,
    onOpenItem,
  }: Props = $props()

  const ROW_PITCH = $derived(isMobile() ? 72 : 96)
  const FALLOFF = $derived(isMobile() ? 130 : 180)

  // Tweened scroll offset initialized using untrack to prevent reactive capture warning
  const scrollY = tweened(untrack(() => -activeItemIndex * (isMobile() ? 72 : 96)), { duration: 300, easing: EASE })

  $effect(() => {
    scrollY.set(-activeItemIndex * ROW_PITCH)
  })

  function resolveItemVisuals(dy: number, rowPitch: number, falloff: number) {
    const adyF = Math.abs(dy) / falloff
    const adyR = Math.abs(dy) / rowPitch
    const scale = Math.abs(dy) >= falloff ? 0.8 : 0.8 + (1 - adyF ** 2) * 0.2
    const opacity =
      dy < 0
        ? Math.abs(dy) >= rowPitch ? 0 : 1 - adyR ** 2
        : Math.abs(dy) >= falloff ? 0.4 : 0.4 + (1 - adyF ** 2) * 0.6
    const subOpacity = Math.abs(dy) >= falloff ? 0 : (1 - adyF ** 2) ** 2
    return { scale, opacity, subOpacity }
  }
</script>

{#if category.items.length === 0}
  <div
    class="px-8 py-4 col-start-1 row-start-1"
    in:fly={{ x: 20, duration: 300, easing: EASE }}
    out:fly={{ x: -20, duration: 300, easing: EASE }}
  >
    <p class="text-sm text-[var(--text-muted)] font-mono">{t('apps.loading')}</p>
  </div>
{:else}
  <div
    role="listbox"
    class="w-full flex flex-col gap-1 col-start-1 row-start-1"
    style:transform="translateY({$scrollY}px)"
    in:fly={{ x: 20, duration: 300, easing: EASE }}
    out:fly={{ x: -20, duration: 300, easing: EASE }}
  >
    {#each category.items as item, i (item.id)}
      {@const dy = i * ROW_PITCH + $scrollY}
      {@const { scale, opacity, subOpacity } = resolveItemVisuals(dy, ROW_PITCH, FALLOFF)}

      <div class="w-full shrink-0 origin-left">
        <ItemEntry
          {item}
          isActive={i === activeItemIndex}
          {opacity}
          {scale}
          {subOpacity}
          onclick={() => {
            if (i === activeItemIndex) {
              onOpenItem(i)
            } else {
              onSelectItem(i)
            }
          }}
        />
      </div>
    {/each}
  </div>
{/if}
