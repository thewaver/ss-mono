<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarExampleProps } from "../ToolbarPage.types";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Bold" },
        { value: "Italic" },
        { value: "Underline" },
        { value: "Align left" },
        { value: "Align center" },
        { value: "Bullets" },
        { value: "Numbering" },
    ];

    type Props = ToolbarExampleProps;

    let props: Props = $props();
</script>

<Toolbar
    actions={ACTIONS}
    gap={props.gap}
    ariaLabel={"Formatting"}
    overflowAriaLabel={"More formatting actions"}
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
