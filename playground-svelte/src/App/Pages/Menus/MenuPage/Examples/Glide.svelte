<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import PageGlideFloater from "../../../../StyledComponents/GlideFloater/PageGlideFloater.svelte";
    import PageMenuItemContent from "../../../../StyledComponents/MenuItemContent/MenuItemContent.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuExampleProps } from "../MenuPage.types";

    type Props = MenuExampleProps;

    let props: Props = $props();
</script>

<Menu items={ACTIONS} ariaLabel={"Edit actions, gliding"} renderPopup={renderMenuPopup} onActivate={props.onActivate}>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>{"Edit"}</PageMenuTriggerContent>
    {/snippet}

    {#snippet renderItem(item, flags)}
        <PageMenuItemContent
            flags={{ ...flags, isHovered: false, isHighlighted: false }}
            kind={item.kind}
            shortcut={item.value.shortcut ?? ""}
        >
            {item.value.name}
        </PageMenuItemContent>
    {/snippet}

    {#snippet renderHighlightFloater(visibilityTarget, transitionDurationMs)}
        <PageGlideFloater kind={"highlight"} {visibilityTarget} {transitionDurationMs} />
    {/snippet}
</Menu>
