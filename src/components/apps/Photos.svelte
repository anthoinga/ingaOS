<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { getPhotos, urlFor, type Photo } from '@/lib/sanity'
  import type { SanityImageSource } from '@sanity/image-url'
  import type { AppProps } from '@/types'
  import { t } from '@/lib/i18n.svelte'

  let { onClose: _onClose }: AppProps = $props()

  let photos = $state<Photo[]>([])
  let lightbox = $state<Photo | null>(null)
  let loading = $state(true)

  onMount(async () => {
    try {
      photos = await getPhotos()
    } catch (e) {
      console.error(e)
    } finally {
      loading = false
    }
  })
</script>

{#if loading}
  <div class="h-full flex items-center justify-center">
    <p class="text-sm text-[var(--text-muted)] font-mono">{t('apps.loading')}</p>
  </div>
{:else if photos.length === 0}
  <div class="h-full flex items-center justify-center">
    <p class="text-sm text-[var(--text-muted)] font-mono">No photos yet.</p>
  </div>
{:else}
  <div class="h-full overflow-y-auto px-4 py-4">
    <div class="columns-2 sm:columns-3 gap-2">
      {#each photos as photo (photo._id)}
        <button
          onclick={() => lightbox = photo}
          class="block w-full mb-2 rounded-lg overflow-hidden border-0 p-0 bg-transparent cursor-pointer"
        >
          <img
            src={urlFor(photo.image as SanityImageSource).width(400).url()}
            alt={photo.caption ?? ''}
            class="w-full object-cover hover:scale-[1.02] transition-transform duration-200 block"
          />
        </button>
      {/each}
    </div>
  </div>

  {#if lightbox}
    <div
      transition:fade={{ duration: 150 }}
      class="absolute inset-0 z-10 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
      onclick={() => lightbox = null}
      onkeydown={(e) => e.key === 'Escape' && (lightbox = null)}
      role="button"
      tabindex="0"
      aria-label="Close lightbox"
    >
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <img
        src={urlFor(lightbox.image as SanityImageSource).width(1200).url()}
        alt={lightbox.caption ?? ''}
        class="max-w-full max-h-full rounded-lg object-contain cursor-default"
        onclick={(e) => e.stopPropagation()}
      />
      {#if lightbox.caption}
        <p class="absolute bottom-6 left-0 right-0 text-center text-sm text-white/70 font-sans pointer-events-none">
          {lightbox.caption}
        </p>
      {/if}
    </div>
  {/if}
{/if}
