<script lang="ts">
    import Markup from "./Markup.svelte";
    import type { MarkupProps } from "./typeUtils.js";

    let props: MarkupProps = $props();
</script>

{#if Array.isArray(props.markup)}
    {#each props.markup as entry, index (index)}
        <Markup markup={entry} />
    {/each}
{:else if props.markup && "snippet" in props.markup}
    {@render props.markup.snippet()}
{:else if props.markup && "component" in props.markup}
    <props.markup.component {...props.markup.props} />
{/if}
