<script lang="ts">
    import type { AnchorPlacement, InteractionFlags } from "@thewaver/ss-components-svelte";
    import { Button } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ButtonExampleProps } from "../ButtonPage.types";

    type Props = ButtonExampleProps;

    let props: Props = $props();
</script>

<Button
    isDisabled={true}
    isReachableWhenDisabled={true}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: tooltip,
    }}
    onClick={props.onClick}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Click Me</PageButtonContent>
    {/snippet}
</Button>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: AnchorPlacement, flags: InteractionFlags)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        {`Focusable so this tooltip can be read, but clicking and pressing Enter must leave the count at zero. The shell reports isDisabled: ${flags.isDisabled}.`}
    </PageTooltipContent>
{/snippet}
