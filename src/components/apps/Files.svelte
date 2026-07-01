<script lang="ts">
  import { onMount } from 'svelte'
  import { getTalks, urlFor, type Talk } from '@/lib/sanity'
  import type { SanityImageSource } from '@sanity/image-url'
  import type { AppProps } from '@/types'
  import type { PDFDocumentProxy } from 'pdfjs-dist'

  let { onClose: _onClose }: AppProps = $props()

  let talks = $state<Talk[]>([])
  let selected = $state<Talk | null>(null)
  let loading = $state(true)
  let pdfDoc = $state<PDFDocumentProxy | null>(null)
  let numPages = $state(0)
  let loadingPdf = $state(false)

  onMount(async () => {
    try {
      talks = await getTalks()
    } catch (e) {
      console.error('Error fetching talks:', e)
    } finally {
      loading = false
    }
  })

  // Svelte action to render a PDF page directly onto a canvas
  function renderPage(node: HTMLCanvasElement, pageNum: number) {
    let active = true

    async function load() {
      if (!pdfDoc) return
      try {
        const page = await pdfDoc.getPage(pageNum)
        if (!active) return

        const context = node.getContext('2d')
        if (!context) return

        // Compute layout dimensions relative to parent width
        const parentWidth = node.parentElement?.clientWidth || window.innerWidth - 32
        const viewportWidth = Math.min(parentWidth, 800)
        
        const unscaledViewport = page.getViewport({ scale: 1.0 })
        const scale = viewportWidth / unscaledViewport.width
        const viewport = page.getViewport({ scale })

        node.width = viewport.width
        node.height = viewport.height

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise
      } catch (err) {
        console.error(`Error rendering page ${pageNum}:`, err)
      }
    }

    load()

    return {
      destroy() {
        active = false
      }
    }
  }

  async function handleSelect(talk: Talk) {
    selected = talk
    loadingPdf = true
    pdfDoc = null
    numPages = 0
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
      pdfDoc = await pdfjsLib.getDocument(talk.pdf.asset.url).promise
      numPages = pdfDoc.numPages
    } catch (err) {
      console.error('Error loading PDF:', err)
    } finally {
      loadingPdf = false
    }
  }
</script>

{#if loading}
  <div class="h-full flex items-center justify-center">
    <p class="text-sm text-[var(--text-muted)] font-mono">Loading...</p>
  </div>
{:else if selected}
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[var(--bg-raised)] bg-[var(--bg-surface)]">
      <button
        onclick={() => selected = null}
        class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-mono"
      >
        ← Back
      </button>
      <span class="text-sm text-[var(--text-muted)] font-mono">
        {#if loadingPdf}
          Loading document...
        {:else}
          {numPages} pages
        {/if}
      </span>
    </div>
    
    <div class="flex-1 overflow-y-auto flex flex-col items-center gap-4 py-6 px-4 bg-[var(--bg-primary)]">
      {#if loadingPdf}
        <p class="text-sm text-[var(--text-muted)] font-mono mt-8">Loading PDF pages...</p>
      {:else if pdfDoc}
        {#each Array(numPages) as _, i (i)}
          <div class="w-full max-w-2xl bg-white shadow-xl rounded-lg overflow-hidden border border-neutral-200">
            <canvas use:renderPage={i + 1} class="block mx-auto max-w-full"></canvas>
          </div>
        {/each}
      {/if}
    </div>
  </div>
{:else}
  <div class="h-full overflow-y-auto px-6 py-6">
    {#if talks.length === 0}
      <div class="h-full flex items-center justify-center">
        <p class="text-sm text-[var(--text-muted)] font-mono">No talks uploaded yet.</p>
      </div>
    {:else}
      <h2 class="text-lg font-display font-semibold text-[var(--text-primary)] mb-6 tracking-wide">
        Talks & Files
      </h2>
      <div class="flex flex-col gap-3">
        {#each talks as talk (talk._id)}
          <button
            onclick={() => handleSelect(talk)}
            class="flex items-center gap-4 rounded-xl p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-raised)] transition-all duration-200 text-left border border-[var(--bg-raised)] hover:border-[var(--text-muted)]/20"
          >
            {#if talk.coverImage}
              <img
                src={urlFor(talk.coverImage as SanityImageSource).width(80).height(80).url()}
                alt=""
                class="w-12 h-12 rounded-lg object-cover shrink-0"
              />
            {:else}
              <div class="w-12 h-12 rounded-lg bg-[var(--bg-raised)] flex items-center justify-center shrink-0 text-xl">
                📄
              </div>
            {/if}
            <div class="min-w-0 flex-1">
              <p class="font-medium text-sm text-[var(--text-primary)] truncate">{talk.title}</p>
              {#if talk.event}
                <p class="text-xs text-[var(--text-muted)] truncate mt-0.5">{talk.event}</p>
              {/if}
              {#if talk.date}
                <p class="text-[10px] text-[var(--text-muted)] font-mono mt-1">{talk.date}</p>
              {/if}
            </div>
            <span class="text-[var(--accent)] text-xs font-mono shrink-0 bg-[var(--accent)]/10 px-2 py-1 rounded">
              VIEW
            </span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
{/if}
