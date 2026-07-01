<script lang="ts">
  import { fade, fly, scale } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { t } from '@/lib/i18n.svelte'
  import type { CategoryKey, MTBItem } from '@/types'
  import type { Component } from 'svelte'

  const APP_LOADERS: Partial<Record<string, () => Promise<{ default: Component }>>> = {
    work:     () => import('../apps/Work.svelte'),
    files:    () => import('../apps/Files.svelte'),
    settings: () => import('../apps/Settings.svelte'),
    built:    () => import('../apps/Experiments.svelte'),
    browser:  () => import('../apps/Browser.svelte'),
    photos:   () => import('../apps/Photos.svelte'),
    music:    () => import('../apps/Music.svelte'),
    contacts: () => import('../apps/Contacts.svelte'),
    games:    () => import('../apps/GalagaDemo.svelte'),
  }

  const SIDEBAR_APPS = new Set<string>(['settings', 'contacts'])

  interface Props {
    openApp: CategoryKey | null
    activeItem: MTBItem | null
    onClose: () => void
  }

  let { openApp, activeItem, onClose }: Props = $props()

  let ActiveApp = $state<Component | null>(null)
  let isSidebar = $derived(openApp ? SIDEBAR_APPS.has(openApp) : false)

  $effect(() => {
    if (!openApp) { ActiveApp = null; return }
    APP_LOADERS[openApp]?.().then(m => { ActiveApp = m.default })
  })
</script>

{#if openApp && ActiveApp && isSidebar}
  <!-- Click-to-close backdrop -->
  <div
    transition:fade={{ duration: 200 }}
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    class="absolute inset-0 z-20 bg-black/60 cursor-pointer"
    role="button"
    tabindex="0"
    aria-label="Close panel"
  ></div>

  <!-- Sidebar panel -->
  <div
    transition:fly={{ x: 400, duration: 250 }}
    class="absolute right-0 top-0 bottom-0 w-[400px] max-w-[85vw] z-30 flex flex-col glass-sidebar"
  >
    <header class="flex items-center justify-between px-5 py-4 shrink-0">
      <button
        onclick={onClose}
        class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-mono"
      >
        ← {t('apps.back')}
      </button>
    </header>
    <div class="flex-1 overflow-hidden">
      <ActiveApp {onClose} item={activeItem ?? undefined} />
    </div>
  </div>
{:else if openApp && ActiveApp}
  <!-- Fullscreen app panel -->
  <div
    transition:scale={{ start: 0.96, duration: 200, easing: cubicOut }}
    class="absolute inset-0 z-20 flex flex-col bg-[var(--bg-primary)]"
  >
    <header class="flex items-center justify-between px-5 py-3 border-b border-[var(--bg-raised)] shrink-0">
      <button
        onclick={onClose}
        class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-mono"
      >
        ← {t('apps.back')}
      </button>
    </header>
    <div class="flex-1 overflow-hidden">
      <ActiveApp {onClose} item={activeItem ?? undefined} />
    </div>
  </div>
{/if}
