<script lang="ts">
  import {
    Settings,
    Briefcase,
    Hammer,
    Globe,
    Image as ImageIcon,
    Music2,
    FileText,
    User,
    Gamepad2,
  } from 'lucide-svelte'
  import { cn } from '@/lib/utils'
  import type { Category } from '@/types'
  import { t } from '@/lib/i18n.svelte'
  import type { ComponentType } from 'svelte'

  const ICON_MAP: Record<string, ComponentType> = {
    settings: Settings,
    work: Briefcase,
    built: Hammer,
    browser: Globe,
    photos: ImageIcon,
    music: Music2,
    files: FileText,
    contacts: User,
    games: Gamepad2,
  }

  interface Props {
    category: Category
    isActive: boolean
    onclick: () => void
  }

  let { category, isActive, onclick }: Props = $props()

  let IconComponent = $derived(ICON_MAP[category.key] || Globe)
</script>

<button
  {onclick}
  class={cn(
    'flex flex-col items-center gap-3 px-2 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 select-none focus:outline-none',
    isActive ? 'scale-110' : 'scale-[0.9] text-neutral-500'
  )}
  aria-label={t(category.labelKey)}
>
  <IconComponent
    class={cn(
      'w-12 h-12 sm:w-20 sm:h-20 transition-all duration-200',
      isActive ? 'text-white drop-shadow-[0_0_8px_var(--accent)]' : 'text-current'
    )}
    strokeWidth={1.75}
    fill="none"
  />
  {#if isActive}
    <span class="text-sm sm:text-base font-medium tracking-wide font-sans text-white">
      {t(category.labelKey)}
    </span>
  {/if}
</button>
