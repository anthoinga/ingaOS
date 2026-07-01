<script lang="ts">
  let { value }: { value: { text: string } } = $props()
</script>

<blockquote class="border-l-2 border-[var(--accent)] pl-4 my-4 text-[var(--text-muted)] italic">
  {value.text}
</blockquote>
