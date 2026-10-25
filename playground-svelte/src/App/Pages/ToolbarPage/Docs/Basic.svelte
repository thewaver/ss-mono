<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarBasicDocsExampleProps } from "../ToolbarPageSvelte.types";
    import ResizableBar from "./ResizableBar.svelte";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Bold" },
        { value: "Italic" },
        { value: "Underline" },
        { value: "Align left" },
        { value: "Align center" },
        { value: "Bullets" },
        { value: "Numbering" },
    ];

    type Props = ToolbarBasicDocsExampleProps;

    let props: Props = $props();

    let lastRun = $state<string>();
</script>

<ResizableBar width={props.barWidth} onResize={props.onBarWidthChange}>
    <Toolbar
        actions={ACTIONS}
        gap={props.gap}
        ariaLabel={"Formatting"}
        overflowAriaLabel={"More formatting actions"}
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
</ResizableBar>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
