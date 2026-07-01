<script lang="ts">
  import { onMount } from 'svelte'
  import { musicState, type Track } from '@/hooks/musicState.svelte'
  import type { AppProps } from '@/types'

  let { onClose: _onClose }: AppProps = $props()

  let tracklist = $state<Track[]>([])

  onMount(async () => {
    try {
      const r = await fetch('/music/tracklist.json')
      tracklist = await r.json()
    } catch (e) {
      console.error(e)
    }
  })

  const duration = $derived(musicState.currentTrack?.duration ?? 0)

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }
</script>

<div class="h-full flex flex-col px-6 py-6 max-w-md">
  <!-- Now playing -->
  <div class="flex flex-col items-center mb-6">
    <div class="w-40 h-40 rounded-xl bg-[var(--bg-raised)] flex items-center justify-center mb-4 overflow-hidden shadow-md">
      {#if musicState.currentTrack?.cover}
        <img src={musicState.currentTrack.cover} alt="" class="w-full h-full object-cover" />
      {:else}
        <span class="text-4xl">🎵</span>
      {/if}
    </div>
    <p class="font-medium text-[var(--text-primary)] text-center font-sans">
      {musicState.currentTrack?.title ?? 'No track selected'}
    </p>
    <p class="text-sm text-[var(--text-muted)] text-center font-sans mt-0.5">
      {musicState.currentTrack?.artist ?? ''}
    </p>
  </div>

  <!-- Progress -->
  <div class="mb-4">
    <input
      type="range"
      min={0}
      max={duration || 1}
      value={musicState.progress}
      oninput={(e) => musicState.seek(Number((e.target as HTMLInputElement).value))}
      class="w-full accent-[var(--accent)]"
    />
    <div class="flex justify-between text-xs text-[var(--text-muted)] font-mono mt-1">
      <span>{fmt(musicState.progress)}</span>
      <span>{fmt(duration)}</span>
    </div>
  </div>

  <!-- Controls -->
  <div class="flex items-center justify-center gap-6 mb-6">
    <button
      onclick={() => musicState.isPlaying ? musicState.pause() : musicState.resume()}
      class="w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] flex items-center justify-center text-lg font-bold disabled:opacity-50 cursor-pointer border-0"
      disabled={!musicState.currentTrack}
    >
      {musicState.isPlaying ? '⏸' : '▶'}
    </button>
  </div>

  <!-- Volume -->
  <div class="flex items-center gap-3 mb-6">
    <span class="text-xs text-[var(--text-muted)]">🔈</span>
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={musicState.volume}
      oninput={(e) => musicState.setVolume(Number((e.target as HTMLInputElement).value))}
      class="flex-1 accent-[var(--accent)]"
    />
    <span class="text-xs text-[var(--text-muted)]">🔊</span>
  </div>

  <!-- Track list -->
  <div class="flex-1 overflow-y-auto">
    {#each tracklist as track (track.id)}
      <button
        onclick={() => musicState.play(track)}
        class="w-full flex items-center gap-3 py-2 px-2 rounded-lg text-left transition-colors cursor-pointer border-0 bg-transparent {musicState.currentTrack?.id === track.id
          ? 'bg-[var(--bg-raised)] text-[var(--text-primary)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}"
      >
        <span class="text-lg shrink-0 font-mono">
          {musicState.currentTrack?.id === track.id && musicState.isPlaying ? '▶' : '♪'}
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium truncate font-sans">{track.title}</p>
          <p class="text-xs text-[var(--text-muted)] truncate font-sans mt-0.5">{track.artist}</p>
        </div>
      </button>
    {/each}
    {#if tracklist.length === 0}
      <p class="text-sm text-[var(--text-muted)] text-center py-4 font-mono">
        Add MP3s to /public/music/ and update tracklist.json
      </p>
    {/if}
  </div>
</div>
