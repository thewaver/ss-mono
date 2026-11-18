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
    import { MOVES_SELECTION_CLIPBOARD_TEXT, COPIES_SELECTION_CLIPBOARD_TEXT, NOTHING_SELECTED_SO_THERE_TEXT, DELETES_SELECTION_TEXT, PUTS_CLIPBOARD_WHERE_CARET_TEXT, TAKES_BACK_LAST_CHANGE_TEXT, MORE_EDITING_ACTIONS_LABEL } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

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
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{MOVES_SELECTION_CLIPBOARD_TEXT}</PageTooltipContent>
{/snippet}

{#snippet copyHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{COPIES_SELECTION_CLIPBOARD_TEXT}</PageTooltipContent>
{/snippet}

{#snippet clearHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{DELETES_SELECTION_TEXT}</PageTooltipContent>
{/snippet}

{#snippet clearDisabledHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>
        {NOTHING_SELECTED_SO_THERE_TEXT}
    </PageTooltipContent>
{/snippet}

{#snippet pasteHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{PUTS_CLIPBOARD_WHERE_CARET_TEXT}</PageTooltipContent>
{/snippet}

{#snippet undoHint(visibilityTarget: 0 | 1, transitionDurationMs: number, _placement: unknown, _flags: unknown, arrowAim: ShapeArrowAim | undefined)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs} {arrowAim}>{TAKES_BACK_LAST_CHANGE_TEXT}</PageTooltipContent>
{/snippet}

<ResizableBar>
    <SharedTooltip>
        <Toolbar
            {actions}
            ariaLabel={"Editing"}
            overflowAriaLabel={MORE_EDITING_ACTIONS_LABEL}
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
