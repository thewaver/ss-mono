<script lang="ts">
    import type { ShapeArrowAim } from "@thewaver/ss-utils";
    import { SharedTooltip, Toolbar } from "@thewaver/ss-components-svelte";
    import type { AnchorPlacement, InteractionTooltipDefs, ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarTooltipDocsExampleProps } from "../ToolbarPageSvelte.types";
    import ResizableBar from "./ResizableBar.svelte";

    const PLACEMENT: AnchorPlacement = { x: "center", y: "top_out" };

    const OFFSET = { x: 0, y: 8 };

    const toHint = (renderContent: InteractionTooltipDefs["renderContent"]): InteractionTooltipDefs => ({
        placement: PLACEMENT,
        offset: OFFSET,
        hoverShowDelayMs: TOOLTIP_HOVER_DELAY_MS,
        renderContent,
    });

    type Props = ToolbarTooltipDocsExampleProps;

    let props: Props = $props();

    let lastRun = $state<string>();

    const actions: ToolbarAction<string>[] = $derived([
        { value: "Cut", tooltipDefs: toHint(cutHint) },
        { value: "Copy", tooltipDefs: toHint(copyHint) },
        {
            value: "Clear",
            isDisabled: props.isDisabled,
            isReachableWhenDisabled: props.isReachableWhenDisabled,
            tooltipDefs: toHint(props.isDisabled ? clearDisabledHint : clearHint),
        },
        { value: "Paste", tooltipDefs: toHint(pasteHint) },
        { value: "Undo", tooltipDefs: toHint(undoHint) },
    ]);
</script>

{#snippet cutHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>Moves the selection to the clipboard</PageTooltipContent>
{/snippet}

{#snippet copyHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>Copies the selection to the clipboard</PageTooltipContent>
{/snippet}

{#snippet clearHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>Deletes the selection</PageTooltipContent>
{/snippet}

{#snippet clearDisabledHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>
        Nothing is selected, so there is nothing to clear
    </PageTooltipContent>
{/snippet}

{#snippet pasteHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>Puts the clipboard where the caret is</PageTooltipContent>
{/snippet}

{#snippet undoHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>Takes back the last change</PageTooltipContent>
{/snippet}

<ResizableBar>
    <SharedTooltip>
        <Toolbar
            {actions}
            ariaLabel={"Editing"}
            overflowAriaLabel={"More editing actions"}
            renderOverflowItem={renderToolbarOverflowItem}
            renderOverflowPopup={renderToolbarPopup}
            onActivate={(value) => {
                lastRun = value;
            }}
        >
            {#snippet renderAction(action, flags)}
                <PageButtonContent {flags}>{action.value}</PageButtonContent>
            {/snippet}

            {#snippet renderOverflowTrigger(flags)}
                <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
            {/snippet}
        </Toolbar>
    </SharedTooltip>
</ResizableBar>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
