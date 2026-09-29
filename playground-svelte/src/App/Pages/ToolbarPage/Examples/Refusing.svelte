<script lang="ts">
    import { Toolbar } from "@thewaver/ss-components-svelte";
    import type { ToolbarAction } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageMenuTriggerContent from "../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { renderToolbarOverflowItem, renderToolbarPopup } from "../ToolbarPage.const.svelte";
    import type { ToolbarExampleProps } from "../ToolbarPage.types";

    const ACTIONS: ToolbarAction<string>[] = [
        { value: "Undo" },
        { value: "Redo" },
        { value: "Comment" },
        { value: "Share", collapse: "never" },
        { value: "Print", collapse: "always" },
        { value: "Archive" },
        { value: "Rename", isDisabled: true },
    ];

    type Props = ToolbarExampleProps;

    let props: Props = $props();
</script>

<Toolbar
    actions={ACTIONS}
    gap={props.gap}
    ariaLabel={"Document"}
    overflowAriaLabel={"More document actions"}
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
