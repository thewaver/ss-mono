<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuItemContent from "../../../../StyledComponents/MenuItemContent/MenuItemContent.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, NOTHING_RUN, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuGlideDocsExampleProps } from "../MenuPageSvelte.types";

    type Props = MenuGlideDocsExampleProps;

    let props: Props = $props();

    let lastRun = $state(NOTHING_RUN);
</script>

<Menu
    renderHighlightFloater={props.isGliding ? renderPageHighlightFloater : undefined}
    items={ACTIONS}
    ariaLabel={"Edit actions"}
    renderPopup={renderMenuPopup}
    onActivate={(action) => {
        lastRun = action.name;
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Edit</PageMenuTriggerContent>
    {/snippet}

    {#snippet renderItem(item, flags)}
        <PageMenuItemContent isGliding={props.isGliding} {flags} kind={item.kind} shortcut={item.value.shortcut ?? ""}>
            {item.value.name}
        </PageMenuItemContent>
    {/snippet}
</Menu>

<div class={exampleStyles.exampleReadout} data-readout>{`Last run: ${lastRun}`}</div>
