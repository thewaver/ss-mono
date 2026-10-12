<script lang="ts">
    import { SharedTooltip, Toolbar } from "@thewaver/ss-components-svelte";
    import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-svelte";
    import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarExampleProps } from "../ToolbarPage.types";

    const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

    const OFFSET = { x: 0, y: 8 };

    const toHint = (renderContent: InteractionTooltipDefs["renderContent"]): InteractionTooltipDefs => ({
        placement: PLACEMENT,
        offset: OFFSET,
        hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
        renderContent,
    });

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Cut", tooltipDefs: toHint(cutHint) },
        { value: "Copy", tooltipDefs: toHint(copyHint) },
        { value: "Clear", isDisabled: true },
        { value: "Paste", tooltipDefs: toHint(pasteHint) },
        { value: "Undo", tooltipDefs: toHint(undoHint) },
    ];

    type Props = ToolbarExampleProps;

    let props: Props = $props();
</script>

{#snippet cutHint(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Moves the selection to the clipboard</PageTooltipContent>
{/snippet}

{#snippet copyHint(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Copies the selection to the clipboard</PageTooltipContent>
{/snippet}

{#snippet pasteHint(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Puts the clipboard where the caret is</PageTooltipContent>
{/snippet}

{#snippet undoHint(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Takes back the last change</PageTooltipContent>
{/snippet}

<SharedTooltip>
    <Toolbar
        actions={ACTIONS}
        gap={props.gap}
        ariaLabel={"Editing"}
        overflowAriaLabel={"More editing actions"}
        renderOverflowItem={renderToolbarOverflowItem}
        renderOverflowPopup={renderToolbarPopup}
        onActivate={props.onActivate}
    >
        {#snippet renderAction(action, flags)}
            <PageButtonContent {flags}>{action.value}</PageButtonContent>
        {/snippet}

        {#snippet renderOverflowTrigger(flags)}
            <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
        {/snippet}
    </Toolbar>
</SharedTooltip>
