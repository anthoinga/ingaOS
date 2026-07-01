<script lang="ts">
  import { urlFor } from '@/lib/sanity'
  import type { SanityImageSource } from '@sanity/image-url'
  
  let { value }: { value: { leftImage: SanityImageSource; rightImage: SanityImageSource; caption?: string } } = $props()
</script>

<figure class="my-4">
  <div class="grid grid-cols-2 gap-2">
    <img src={urlFor(value.leftImage).width(450).url()} alt="" class="rounded-lg w-full" />
    <img src={urlFor(value.rightImage).width(450).url()} alt="" class="rounded-lg w-full" />
  </div>
  {#if value.caption}
    <figcaption class="text-xs text-center text-[var(--text-muted)] mt-2">{value.caption}</figcaption>
  {/if}
</figure>
