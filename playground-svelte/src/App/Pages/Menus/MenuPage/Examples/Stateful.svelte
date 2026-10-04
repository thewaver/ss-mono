<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { Action, MenuExampleProps } from "../MenuPage.types";

    type Props = MenuExampleProps & { checked: Action[] };

    let { checked = $bindable(), ...props }: Props = $props();
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={VIEW_OPTIONS}
    ariaLabel={"View options"}
    bind:checked
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>View</PageMenuTriggerContent>
    {/snippet}
</Menu>
