<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { CheckboxExampleProps } from "../CheckboxPage.types";

    type Props = CheckboxExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Checkbox
    bind:checked
    ariaLabel={"Disabled but reachable checkbox"}
    isDisabled={true}
    isReachableWhenDisabled={true}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags} />
    {/snippet}
</Checkbox>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but clicking and pressing Space must leave it checked.
    </PageTooltipContent>
{/snippet}
