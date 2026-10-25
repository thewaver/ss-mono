<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import ResizableBar from "./ResizableBar.svelte";

    const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

    let pressedValues = $state.raw<string[]>([]);
</script>

<ResizableBar>
    <Toolbar
        actions={ACTIONS}
        ariaLabel={"Text style"}
        overflowAriaLabel={"More text styles"}
        bind:pressedValues
        renderOverflowItem={renderToolbarOverflowItem}
        renderOverflowPopup={renderToolbarPopup}
        onActivate={() => {}}
    >
        {#snippet renderAction(action, flags)}
            <PageButtonContent {flags}>
                <span class={[styles.pressedMark, flags.isPressed && styles.isPressed]}>{action.value}</span>
            </PageButtonContent>
        {/snippet}

        {#snippet renderOverflowTrigger(flags)}
            <PageMenuTriggerContent {flags}>More</PageMenuTriggerContent>
        {/snippet}
    </Toolbar>
</ResizableBar>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Pressed: ${pressedValues.join(", ") || "nothing"}`}
</div>
