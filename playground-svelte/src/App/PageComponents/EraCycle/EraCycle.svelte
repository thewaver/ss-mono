<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageEraCycleContent from "../../StyledComponents/EraCycleContent/EraCycleContent.svelte";
    import type { EraCycleProps } from "./EraCycle.types";

    const SINGLE_ERA = 1;

    let props: EraCycleProps = $props();

    const current = $derived(props.options.find((option) => option.id === props.era));

    const label = $derived(current?.name ?? props.era);

    const advance = () => {
        const index = props.options.findIndex((option) => option.id === props.era);

        props.onChange(props.options[(index + 1) % props.options.length].id);
    };
</script>

{#if props.options.length > SINGLE_ERA}
    <Button isDisabled={props.isDisabled} ariaLabel={`Era: ${label}`} onClick={advance}>
        {#snippet renderContent(flags)}
            <PageEraCycleContent {flags}>{current?.shortName ?? props.era}</PageEraCycleContent>
        {/snippet}
    </Button>
{/if}
