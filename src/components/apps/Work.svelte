<script lang="ts">
  import { onMount } from 'svelte'
  import { PortableText } from '@portabletext/svelte'
  import { getCaseStudies, getCaseStudy, urlFor, type CaseStudy } from '@/lib/sanity'
  import type { SanityImageSource } from '@sanity/image-url'
  import type { AppProps } from '@/types'
  import { t } from '@/lib/i18n.svelte'

  import ImageBlock from './portable/ImageBlock.svelte'
  import VideoBlock from './portable/VideoBlock.svelte'
  import PullQuote from './portable/PullQuote.svelte'
  import TwoColumn from './portable/TwoColumn.svelte'

  const portableComponents = {
    types: {
      imageBlock: ImageBlock,
      videoBlock: VideoBlock,
      pullQuote: PullQuote,
      twoColumn: TwoColumn,
    }
  }

  let { onClose: _onClose }: AppProps = $props()

  let studies = $state<CaseStudy[]>([])
  let selected = $state<CaseStudy | null>(null)
  let loading = $state(true)

  onMount(async () => {
    try {
      studies = await getCaseStudies()
    } catch (e) {
      console.error(e)
    } finally {
      loading = false
    }
  })

  async function openStudy(slug: string) {
    try {
      const s = await getCaseStudy(slug)
      if (s) selected = s
    } catch (e) {
      console.error(e)
    }
  }
</script>

{#if loading}
  <div class="h-full flex items-center justify-center">
    <p class="text-sm text-[var(--text-muted)] font-mono">{t('apps.loading')}</p>
  </div>
{:else if selected}
  <div class="h-full overflow-y-auto px-6 py-6 bg-[var(--bg-primary)]">
    <button
      onclick={() => selected = null}
      class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4 transition-colors font-mono cursor-pointer border-0 bg-transparent"
    >
      ← Back
    </button>
    
    {#if selected.coverImage}
      <img
        src={urlFor(selected.coverImage as SanityImageSource).width(900).url()}
        alt={selected.title}
        class="w-full rounded-lg mb-6 object-cover max-h-64 shadow-md"
      />
    {/if}
    
    <h1 class="text-2xl font-display font-semibold text-[var(--text-primary)] mb-1 leading-snug">
      {selected.title}
    </h1>
    
    <p class="text-sm text-[var(--text-muted)] mb-6 font-mono">
      {selected.year}{selected.role ? ` · ${selected.role}` : ''}
    </p>
    
    {#if selected.tags && selected.tags.length > 0}
      <div class="flex flex-wrap gap-2 mb-6">
        {#each selected.tags as tag (tag)}
          <span class="text-xs px-2 py-1 rounded bg-[var(--bg-raised)] text-[var(--text-muted)] font-mono">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
    
    {#if selected.body}
      <div class="prose prose-invert max-w-none text-[var(--text-primary)] font-sans">
        <PortableText
          value={selected.body}
          components={portableComponents}
        />
      </div>
    {/if}
  </div>
{:else if studies.length === 0}
  <div class="h-full flex items-center justify-center">
    <p class="text-sm text-[var(--text-muted)] font-mono">No case studies yet.</p>
  </div>
{:else}
  <div class="h-full overflow-y-auto px-6 py-6">
    <h2 class="text-lg font-display font-semibold text-[var(--text-primary)] mb-6 tracking-wide">
      Work
    </h2>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {#each studies as s (s._id)}
        <button
          onclick={() => openStudy(s.slug.current)}
          class="text-left rounded-xl overflow-hidden bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] border border-[var(--bg-raised)] hover:border-[var(--text-muted)]/20 transition-all duration-200 cursor-pointer p-0 block w-full"
        >
          {#if s.coverImage}
            <img
              src={urlFor(s.coverImage as SanityImageSource).width(600).height(300).url()}
              alt={s.title}
              class="w-full h-36 object-cover block"
            />
          {/if}
          <div class="p-4">
            <p class="font-medium text-sm text-[var(--text-primary)] truncate font-sans">{s.title}</p>
            <p class="text-xs text-[var(--text-muted)] font-mono mt-1">{s.year}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>
{/if}
