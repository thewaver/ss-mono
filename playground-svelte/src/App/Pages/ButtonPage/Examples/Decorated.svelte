<script lang="ts">
    import { Button, Corners, type InteractionActivation } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageRipple from "../../../StyledComponents/Ripple/Ripple.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ButtonPressedExampleProps } from "../ButtonPage.types";

    type Props = ButtonPressedExampleProps;

    let props: Props = $props();

    let activation = $state.raw<InteractionActivation>();
</script>

<Button
    isPressed={props.isPressed}
    onActivation={(next) => {
        activation = next;
    }}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: tooltip,
    }}
    onClick={props.onClick}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Toggle Me</PageButtonContent>
    {/snippet}

    {#snippet renderDecoration(flags)}
        <Corners color={flags.isPressed ? "yellow" : "transparent"} />
        <PageRipple {activation} color={"yellow"} />
    {/snippet}
</Button>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Click me to toggle me.</PageTooltipContent>
{/snippet}
