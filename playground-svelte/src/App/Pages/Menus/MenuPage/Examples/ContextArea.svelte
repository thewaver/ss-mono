<script lang="ts">
    import { ContextMenu } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuPage.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuExampleProps } from "../MenuPage.types";

    type Props = MenuExampleProps;

    let props: Props = $props();
</script>

<ContextMenu
    renderHighlightFloater={renderPageHighlightFloater}
    items={ACTIONS}
    ariaLabel={"Edit actions"}
    regionAriaLabel={"Editing area"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderRegion()}
        <div class={styles.contextRegion}>Right-click anywhere in this box</div>
    {/snippet}
</ContextMenu>
