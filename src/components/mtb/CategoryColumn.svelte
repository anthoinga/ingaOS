<script lang="ts">
  import CategoryIcon from './CategoryIcon.svelte'
  import type { Category, CategoryKey } from '@/types'
  import { isMobile } from '@/hooks/isMobile.svelte'

  interface Props {
    categories: Category[]
    activeCategoryIndex: number
    onSelectCategory: (index: number) => void
    onOpenApp: (key: CategoryKey) => void
  }

  let {
    categories,
    activeCategoryIndex,
    onSelectCategory,
    onOpenApp,
  }: Props = $props()

  let columnEl: HTMLDivElement = $state()
  let iconEls: (HTMLDivElement | null)[] = $state([])

  const activeColumnRatio = $derived(isMobile() ? 0.5 : 0.22)

  let xOffset = $state(0)

  // Slide the column so the active icon sits at the rest ratio from the left edge — MTB pan behaviour
  $effect(() => {
    const activeEl = iconEls[activeCategoryIndex]
    if (!columnEl || !activeEl) return
    const targetX = window.innerWidth * activeColumnRatio
    const iconMid = activeEl.offsetLeft + activeEl.offsetWidth / 2
    xOffset = targetX - iconMid
  })
</script>

<div
  bind:this={columnEl}
  class="flex items-center gap-2 px-8 w-max"
  style:transform="translateX({xOffset}px)"
  style:transition="transform 300ms ease"
  role="tablist"
  aria-label="Categories"
>
  {#each categories as cat, i (cat.key)}
    <div bind:this={iconEls[i]}>
      <CategoryIcon
        category={cat}
        isActive={i === activeCategoryIndex}
        onclick={() => {
          if (i === activeCategoryIndex) {
            onOpenApp(cat.key)
          } else {
            onSelectCategory(i)
          }
        }}
      />
    </div>
  {/each}
</div>
