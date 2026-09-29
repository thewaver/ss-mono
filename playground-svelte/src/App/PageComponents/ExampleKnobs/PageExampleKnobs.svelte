<script lang="ts">
    import type { Snippet } from "svelte";

    import PagePropsPanel from "../PropsPanel/PagePropsPanel.svelte";
    import { getExampleKnobsContext } from "./ExampleKnobs.context";

    let props: { children?: Snippet } = $props();

    const exampleKnobs = getExampleKnobsContext();

    $effect(() => {
        exampleKnobs?.setRenderKnobs(props.children);

        return () => exampleKnobs?.setRenderKnobs(undefined);
    });
</script>

{#if !exampleKnobs}
    <PagePropsPanel scope={"local"}>{@render props.children?.()}</PagePropsPanel>
{/if}
