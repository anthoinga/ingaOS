<script lang="ts">
  import { cn } from '@/lib/utils'
  import { resolveItemMeta } from './itemMeta'
  import type { MTBItem } from '@/types'

  interface Props {
    item: MTBItem
    className?: string
  }

  let { item, className = '' }: Props = $props()

  let meta = $derived(resolveItemMeta(item))
</script>

<div
  class={cn(
    'relative flex flex-col items-center justify-center w-8 h-8 sm:w-12 sm:h-12 rounded-lg border shrink-0 select-none transition-all duration-200',
    meta.colorClass,
    className
  )}
>
  <meta.icon class="w-4 h-4 sm:w-5 h-5" />
  <span class="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 text-[6px] sm:text-[8px] font-bold font-mono tracking-wider opacity-80 uppercase">
    {meta.extension}
  </span>
</div>
