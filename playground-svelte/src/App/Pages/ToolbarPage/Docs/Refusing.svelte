<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import ResizableBar from "./ResizableBar.svelte";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Undo" },
        { value: "Redo" },
        { value: "Comment" },
        { value: "Share", collapse: "never" },
        { value: "Print", collapse: "always" },
        { value: "Archive" },
        { value: "Rename", isDisabled: true },
    ];

    let lastRun = $state<string>();
</script>

<ResizableBar>
    <Toolbar
        actions={ACTIONS}
        ariaLabel={"Document"}
        overflowAriaLabel={"More document actions"}
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
