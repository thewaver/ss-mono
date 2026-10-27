<script lang="ts">
    import type { FormValueProps } from "./FormValue.types.js";

    let props: FormValueProps = $props();
</script>

{#if props.name}
    {#each props.values as value, index (index)}
        <input type="hidden" name={props.name} {value} />
    {/each}
{/if}
