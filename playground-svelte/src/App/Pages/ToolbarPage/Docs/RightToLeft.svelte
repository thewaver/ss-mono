<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import ResizableBar from "./ResizableBar.svelte";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Bold" },
        { value: "Italic" },
        { value: "Underline" },
        { value: "Align right" },
        { value: "Align center" },
        { value: "Bullets" },
        { value: "Numbering" },
    ];

    let lastRun = $state<string>();
</script>

<div dir={"rtl"} class={styles.docsDirectionBox}>
    <ResizableBar>
        <Toolbar
            actions={ACTIONS}
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
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun ?? "nothing yet"}`}</div>
