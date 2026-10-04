<script lang="ts">
    import { on } from "svelte/events";

    import { Toolbar, Tooltip } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";
    import { TOOLTIP_HOVER_DELAY_MS } from "@thewaver/ss-playground/App/StyledComponents/TooltipContent/TooltipContent.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarExampleProps } from "../ToolbarPage.types";

    const ACTIONS: ToolbarAction<string>[] = [{ value: "Cut" }, { value: "Copy" }, { value: "Paste" }, { value: "Undo" }];

    const HINTS: Record<string, string> = {
        Cut: "Moves the selection to the clipboard",
        Copy: "Copies the selection to the clipboard",
        Paste: "Puts the clipboard where the caret is",
        Undo: "Takes back the last change",
    };

    const PLACEMENT = { x: "center", y: "top-out" } as const;
    const OFFSET = { x: 0, y: 8 };

    type Props = ToolbarExampleProps;

    let props: Props = $props();

    let anchor = $state<HTMLElement>();

    const pickAnchor = (target: EventTarget | null) => {
        const button = target instanceof Element ? target.closest<HTMLElement>("button") : null;

        if (button?.querySelector("[data-hint]") && button !== anchor) anchor = button;
    };
</script>

<div
    {@attach (element) => on(element, "pointerover", (e) => pickAnchor(e.target))}
    class={styles.hoverWatch}
    onfocusin={(e) => pickAnchor(e.target)}
>
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
            <PageButtonContent {flags}><span data-hint={action.value}>{action.value}</span></PageButtonContent>
        {/snippet}

        {#snippet renderOverflowTrigger(flags)}
            <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
        {/snippet}
    </Toolbar>

    <Tooltip anchorRef={anchor} placement={PLACEMENT} offset={OFFSET} hoverShowDelayMs={TOOLTIP_HOVER_DELAY_MS}>
        {#snippet renderContent(visibilityTarget, transitionDurationMs)}
            <PageTooltipContent {visibilityTarget} {transitionDurationMs}
                >{HINTS[anchor?.querySelector("[data-hint]")?.getAttribute("data-hint") ?? ""]}</PageTooltipContent
            >
        {/snippet}
    </Tooltip>
</div>
