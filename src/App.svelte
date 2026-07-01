<script lang="ts">
  import LandingPage, { REVEAL_MS } from './components/LandingPage.svelte'
  import MTBShell from './components/mtb/MTBShell.svelte'
  import { playSound, setMuffled } from './effects/soundEngine'
  import './lib/i18n.svelte'

  let view = $state<'landing' | 'reveal' | 'shell'>('landing')
  let landingHovered = $state(false)

  function handleOpen() {
    playSound('boot_up')
    setMuffled(false) // Open master filter
    landingHovered = false
    view = 'reveal'
    setTimeout(() => {
      view = 'shell'
    }, REVEAL_MS)
  }
</script>

<div class="relative w-full h-full">
  <MTBShell
    onExit={() => {
      setMuffled(true) // Muffle master filter when returning to landing page
      view = 'landing'
    }}
    isActive={view === 'shell'}
  />

  {#if view !== 'shell'}
    <LandingPage
      isRevealing={view === 'reveal'}
      isHovered={landingHovered}
    />
    
    <!-- Keyboard/mouse trigger zone for the corner peel -->
    <div
      onmouseenter={() => view === 'landing' && (landingHovered = true)}
      onmouseleave={() => landingHovered = false}
      onclick={handleOpen}
      onkeydown={(e) => e.key === 'Enter' && handleOpen()}
      class="absolute top-0 right-0 w-64 h-64 z-[60] bg-transparent transition-all {view === 'reveal' ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'}"
      role="button"
      tabindex="0"
      aria-label="Enter portfolio"
    ></div>
  {/if}
</div>
