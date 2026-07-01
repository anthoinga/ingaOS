<script lang="ts">
  import { urlFor } from '@/lib/sanity'
  import type { SanityImageSource } from '@sanity/image-url'
  let { value }: { value: { image: SanityImageSource; caption?: string } } = $props()
</script>

<figure class="my-4">
  <img
    src={urlFor(value.image).width(900).url()}
    alt={value.caption ?? ''}
    class="w-full rounded-lg"
  />
  {#if value.caption}
    <figcaption class="text-xs text-center text-[var(--text-muted)] mt-2">{value.caption}</figcaption>
  {/if}
</figure>
