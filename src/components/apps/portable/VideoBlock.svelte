<script lang="ts">
  let { value }: { value: { embedUrl?: string } } = $props()
</script>

{#if value.embedUrl}
  <div class="relative pb-[56.25%] my-4">
    <iframe
      src={value.embedUrl}
      class="absolute inset-0 w-full h-full rounded-lg border-0"
      allowfullscreen
      title="Video embed"
    ></iframe>
  </div>
{/if}
