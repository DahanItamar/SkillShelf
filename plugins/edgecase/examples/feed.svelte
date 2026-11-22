<script>
  import { onMount } from "svelte";
  let posts = null;
  let message = "";
  onMount(async () => {
    try {
      const res = await fetch("/api/posts");
      posts = await res.json();
    } catch (e) {
      message = e.stack;
    }
  });
</script>
{#if posts}
  {#each posts as p}<article>{p.title}</article>{/each}
{:else}
  <pre>{message}</pre>
{/if}
