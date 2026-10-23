<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuGroupBox from "../../../../StyledComponents/MenuItemContent/PageMenuGroupBox.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import PageSelectGroupContent from "../../../../StyledComponents/SelectGroupContent/SelectGroupContent.svelte";
    import { SECTIONED_VIEW_OPTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { Action, MenuExampleProps } from "../MenuPageSvelte.types";

    type Props = MenuExampleProps & { checked: Action[] };

    let { checked = $bindable(), ...props }: Props = $props();
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={SECTIONED_VIEW_OPTIONS}
    ariaLabel={"View options"}
    bind:checked
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>View</PageMenuTriggerContent>
    {/snippet}

    {#snippet renderGroupHeader(group)}
        <PageSelectGroupContent>{group.label}</PageSelectGroupContent>
    {/snippet}

    {#snippet renderGroupBox(renderContent)}
        <PageMenuGroupBox>{@render renderContent()}</PageMenuGroupBox>
    {/snippet}
</Menu>
