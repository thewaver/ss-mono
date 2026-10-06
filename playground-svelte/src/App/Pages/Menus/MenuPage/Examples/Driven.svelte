<script lang="ts">
    import { Button, Menu } from "@thewaver/ss-components-svelte";

    import PageControlButtonContent from "../../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuDrivenExampleProps } from "../MenuPage.types";

    type Props = MenuDrivenExampleProps;

    let { visibility = $bindable(), ...props }: Props = $props();

    let anchorRef = $state<HTMLElement>();
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    bind:visibility
    {anchorRef}
    items={ACTIONS}
    ariaLabel={"Edit actions"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Edit</PageMenuTriggerContent>
    {/snippet}
</Menu>

<Button
    bind:ref={anchorRef}
    id={"menuToggle"}
    onClick={() => {
        visibility = !visibility;
    }}
>
    {#snippet renderContent(flags)}
        <PageControlButtonContent {flags}>{visibility ? "Close it" : "Open it"}</PageControlButtonContent>
    {/snippet}
</Button>
