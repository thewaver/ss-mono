<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/ToolbarPage/ToolbarPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarPressedExampleProps } from "../ToolbarPage.types";

    const ACTIONS: ToolbarAction<string>[] = [{ value: "Bold" }, { value: "Italic" }, { value: "Underline" }];

    type Props = ToolbarPressedExampleProps;

    let { pressedValues = $bindable(), ...props }: Props = $props();
</script>

<Toolbar
    actions={ACTIONS}
    gap={props.gap}
    ariaLabel={"Text style"}
    overflowAriaLabel={"More text styles"}
    bind:pressedValues
    renderOverflowItem={renderToolbarOverflowItem}
    renderOverflowPopup={renderToolbarPopup}
    onActivate={props.onActivate}
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
