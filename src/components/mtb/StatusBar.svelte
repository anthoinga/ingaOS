<script lang="ts">

  import { slide } from 'svelte/transition'
  import { musicState } from '@/hooks/musicState.svelte'
  import { playSound, startIdleLoop, stopIdleLoop, setAmbientTrackIndex } from '@/effects/soundEngine'
  import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    MoreHorizontal,
  } from 'lucide-svelte'

  const AMBIENT_TRACKS = [
    { name: 'Sumaq', desc: 'SUMAQ' },
    { name: 'Kawsay', desc: 'KAWSAY' },
    { name: 'Phuyu', desc: 'PHUYU' },
  ]

  // System Health Grid State
  const numRows = 5
  const numCols = 16
  let history = $state([2, 3, 2, 3, 4, 3, 2, 1, 2, 3, 4, 3, 2, 3, 4, 3])

  // Status Bar States
  let ambientIndex = $state(0)
  let isAmbientPlaying = $state(true)
  let currentTime = $state(new Date())
  let isMenuOpen = $state(false)

  // Derived states
  const isMediaActive = $derived(musicState.currentTrack !== null)
  const isPlaying = $derived(isMediaActive ? musicState.isPlaying : isAmbientPlaying)

  $effect(() => {
    const clockTimer = setInterval(() => {
      currentTime = new Date()
    }, 1000)

    const graphTimer = setInterval(() => {
      const last = history[history.length - 1]
      const change = Math.random() > 0.5 ? 1 : -1
      const next = Math.max(1, Math.min(5, last + change))
      history = [...history.slice(1), next]
    }, 180)

    return () => {
      clearInterval(clockTimer)
      clearInterval(graphTimer)
    }
  })

  function handleTogglePlay() {
    playSound('select_confirm')
    if (isMediaActive) {
      if (musicState.isPlaying) {
        musicState.pause()
      } else {
        musicState.resume()
      }
    } else {
      if (isAmbientPlaying) {
        stopIdleLoop()
        isAmbientPlaying = false
      } else {
        startIdleLoop()
        isAmbientPlaying = true
      }
    }
  }

  function handleNext() {
    playSound('tick_horizontal')
    const nextIdx = (ambientIndex + 1) % AMBIENT_TRACKS.length
    ambientIndex = nextIdx
    setAmbientTrackIndex(nextIdx)
    if (!isAmbientPlaying && !isMediaActive) {
      startIdleLoop()
      isAmbientPlaying = true
    }
  }

  function handlePrev() {
    playSound('tick_horizontal')
    const prevIdx = (ambientIndex - 1 + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length
    ambientIndex = prevIdx
    setAmbientTrackIndex(prevIdx)
    if (!isAmbientPlaying && !isMediaActive) {
      startIdleLoop()
      isAmbientPlaying = true
    }
  }

  // Force mute ambient when media player starts playing
  $effect(() => {
    if (isMediaActive && musicState.isPlaying) {
      isAmbientPlaying = false
    }
  })

  // Date/Time formatting helpers
  const formatDate = (date: Date) => {
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayOfWeek = dayNames[date.getDay()]
    return `${month} ${day} ${dayOfWeek}`
  }

  const hours = $derived(String(currentTime.getHours() % 12 || 12).padStart(2, '0'))
  const minutes = $derived(String(currentTime.getMinutes()).padStart(2, '0'))
  const ampm = $derived(currentTime.getHours() >= 12 ? 'PM' : 'AM')
  const isColonVisible = $derived(currentTime.getSeconds() % 2 === 0)
</script>

{#snippet healthGrid()}
  <div class="flex items-center justify-center shrink-0 py-0.5">
    <div
      class="grid shrink-0 gap-[1px]"
      style:grid-template-columns="repeat({numCols}, minmax(0, 1fr))"
      style:width="{numCols * 3 + (numCols - 1) * 1}px"
    >
      {#each Array(numRows) as _, r (r)}
        {#each Array(numCols) as _, c (c)}
          {@const height = history[c]}
          {@const topRow = 5 - height}
          <div
            class="w-[3px] h-[3px] rounded-[1px] transition-all duration-150 {r === topRow ? 'bg-[var(--accent-mint)] opacity-[0.95]' : r > topRow ? 'bg-[var(--accent-mint)] opacity-[0.25]' : 'bg-[var(--accent-mint)] opacity-[0.06]'}"
          ></div>
        {/each}
      {/each}
    </div>
  </div>
{/snippet}

<div class="flex items-center gap-6 select-none font-mono text-base text-[var(--text-primary)] flex-nowrap flex-shrink-0 relative">
  <!-- Sun Symbol -->
  <div class="flex items-center flex-nowrap flex-shrink-0">
    <span class="opacity-95 text-xl sm:text-3xl leading-none">☀</span>
  </div>

  <div class="w-[1px] h-5 bg-white/15 shrink-0"></div>

  <!-- Desktop Media Controls -->
  <div class="hidden sm:flex items-center gap-4 flex-nowrap flex-shrink-0">
    <span
      class="font-medium tracking-tight opacity-90 max-w-[150px] truncate select-none text-[var(--text-ui-sm)]"
    >
      {isMediaActive && musicState.currentTrack ? musicState.currentTrack.title : AMBIENT_TRACKS[ambientIndex].desc}
    </span>
    <div class="flex items-center gap-2 flex-nowrap flex-shrink-0">
      <button
        onclick={handlePrev}
        class="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
        title="Previous Track"
      >
        <SkipBack size={16} />
      </button>
      <button
        onclick={handleTogglePlay}
        class="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {#if isPlaying}
          <Pause size={16} />
        {:else}
          <Play size={16} />
        {/if}
      </button>
      <button
        onclick={handleNext}
        class="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
        title="Next Track"
      >
        <SkipForward size={16} />
      </button>
    </div>
  </div>

  <div class="hidden md:block w-[1px] h-5 bg-white/15 shrink-0"></div>

  <!-- System Health Grid (Desktop) -->
  <div class="hidden md:flex items-center gap-2.5 opacity-90 flex-nowrap flex-shrink-0" title="System Health: Active">
    {@render healthGrid()}
    <span class="tracking-tight text-[10px] sm:text-xs">SYS_OK</span>
  </div>

  <!-- Mobile "..." Controls Menu -->
  <div class="flex sm:hidden items-center flex-nowrap flex-shrink-0">
    <button
      onclick={() => {
        playSound('select_confirm')
        isMenuOpen = !isMenuOpen
      }}
      class="opacity-70 hover:opacity-100 transition-opacity duration-150 p-0.5 focus:outline-none flex-shrink-0"
      title="More System Controls"
    >
      <MoreHorizontal size={18} />
    </button>
  </div>

  <div class="w-[1px] h-5 bg-white/15 shrink-0"></div>

  <!-- Clock & Date -->
  <div class="flex items-center gap-2.5 opacity-90 tabular-nums flex-nowrap flex-shrink-0 text-[var(--text-ui-sm)]">
    <span>{formatDate(currentTime)}</span>
    <span class="font-bold text-[var(--text-primary)] flex items-center flex-nowrap flex-shrink-0">
      <span>{hours}</span>
      <span class="transition-opacity duration-100 {isColonVisible ? 'opacity-100' : 'opacity-20'}">:</span>
      <span>{minutes}</span>
      <span class="ml-1.5 font-medium opacity-80 text-[var(--text-ui-xs)]">{ampm}</span>
    </span>
  </div>

  <!-- Dropdown Menu for Mobile -->
  {#if isMenuOpen}
    <!-- Transparent backdrop to dismiss on tap -->
    <div 
      class="fixed inset-0 z-40 cursor-default" 
      onclick={() => isMenuOpen = false}
      onkeydown={(e) => e.key === 'Escape' && (isMenuOpen = false)}
      role="presentation"
    ></div>
    
    <!-- Svelte native transition wrapper for the actual panel -->
    <div
      transition:slide={{ duration: 150 }}
      class="absolute top-full right-0 mt-3 z-50 w-72 rounded-lg border border-white/10 bg-neutral-900/90 backdrop-blur-md p-4 shadow-2xl flex flex-col gap-4 text-[var(--text-primary)]"
    >
      <div class="flex flex-col gap-2 w-full py-1">
        <span class="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">NOW PLAYING</span>
        <div class="flex items-center justify-between w-full bg-white/5 rounded-md p-2 border border-white/5">
          <span class="font-mono text-xs font-medium tracking-tight truncate max-w-[140px]">
            {isMediaActive && musicState.currentTrack ? musicState.currentTrack.title : AMBIENT_TRACKS[ambientIndex].desc}
          </span>
          <div class="flex items-center gap-3">
            <button
              onclick={handlePrev}
              class="opacity-80 hover:opacity-100 active:scale-90 transition-all p-1 focus:outline-none flex-shrink-0"
              title="Previous Track"
            >
              <SkipBack size={18} />
            </button>
            <button
              onclick={handleTogglePlay}
              class="opacity-80 hover:opacity-100 active:scale-90 transition-all p-1 focus:outline-none flex-shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {#if isPlaying}
                <Pause size={18} />
              {:else}
                <Play size={18} />
              {/if}
            </button>
            <button
              onclick={handleNext}
              class="opacity-80 hover:opacity-100 active:scale-90 transition-all p-1 focus:outline-none flex-shrink-0"
              title="Next Track"
            >
              <SkipForward size={18} />
            </button>
          </div>
        </div>
      </div>

      <div class="h-[1px] w-full bg-white/10"></div>

      <div class="flex items-center justify-between w-full py-1">
        <span class="text-[10px] text-[var(--text-muted)] font-mono tracking-wider">SYSTEM STATUS</span>
        <div class="flex items-center gap-2 opacity-90">
          {@render healthGrid()}
          <span class="tracking-tight text-xs font-mono">SYS_OK</span>
        </div>
      </div>
    </div>
  {/if}
</div>
