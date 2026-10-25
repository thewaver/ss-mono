<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { PALETTE_LAYOUT, PALETTE_WIDTH } from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.const";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Select" },
        { value: "Brush" },
        { value: "Erase" },
        { value: "Fill" },
        { value: "Text" },
        { value: "Shape" },
        { value: "Crop" },
        { value: "Zoom" },
    ];

    let lastRun = $state<string>();
</script>

<div style:width={PALETTE_WIDTH}>
    <Toolbar
        actions={ACTIONS}
        ariaLabel={"Tools"}
        overflowAriaLabel={"More tools"}
        computeLayout={PALETTE_LAYOUT}
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
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
