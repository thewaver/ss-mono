<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ToggleExampleProps } from "../TogglePage.types";

    type Props = ToggleExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Toggle
    bind:checked
    ariaLabel={"Disabled but reachable toggle"}
    isDisabled={true}
    isReachableWhenDisabled={true}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags} />
    {/snippet}
</Toggle>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but clicking and pressing Space must leave it on.
    </PageTooltipContent>
{/snippet}
