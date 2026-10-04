<script lang="ts">
    import { FanMenu } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/Menus/FanMenuPage/FanMenuPage.css";

    import PageLayer from "../../../../PageComponents/Layer/Layer.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import type { FanMenuExampleProps } from "../FanMenuPage.types";

    const BACK_MARK = "‹";
    const SUBMENU_MARK = "›";

    let props: FanMenuExampleProps = $props();
</script>

<div class={styles.stage}>
    <FanMenu
        layoutSize={"192px"}
        layoutDefs={{ curveHeightRatio: 1, itemWidthRatio: 0.5, itemHeightRatio: 0.2381 }}
        items={props.items}
        ariaLabel={"Edit actions"}
        placement={{ x: "center", y: "center" }}
        onActivate={props.onActivate}
    >
        {#snippet renderContent(flags)}
            <PageMenuTriggerContent {flags}>{props.caption}</PageMenuTriggerContent>
        {/snippet}

        {#snippet renderItem(item, flags)}
            {@const shortcut = !flags.isBack && item.value.shortcut}

            <div
                class={[
                    styles.item,
                    flags.isBack && styles.itemBack,
                    flags.isHighlighted && styles.itemHighlighted,
                    flags.isDisabled && styles.itemDisabled,
                ]}
            >
                {#if flags.isBack}
                    <span aria-hidden={"true"}>{BACK_MARK}</span>
                {/if}

                <span>{item.value.name}</span>

                {#if shortcut}
                    <span class={styles.shortcut}>{shortcut}</span>
                {/if}

                {#if flags.hasSubmenu}
                    <span aria-hidden={"true"}>{SUBMENU_MARK}</span>
                {/if}
            </div>
        {/snippet}

        {#snippet renderHighlightFloater(visibilityTarget, transitionDurationMs)}
            <div
                class={[styles.itemFloater, visibilityTarget === 1 && styles.itemFloaterVisible]}
                style:transition-duration={`${transitionDurationMs}ms`}
                data-floater="highlight"
            ></div>
        {/snippet}

        {#snippet renderPopup(renderItems, visibilityTarget, transitionDurationMs)}
            <div
                class={[styles.layer, visibilityTarget === 1 && styles.layerVisible]}
                style:transition={`opacity ${transitionDurationMs}ms, transform ${transitionDurationMs}ms`}
            >
                <PageLayer level={2}>{@render renderItems()}</PageLayer>
            </div>
        {/snippet}
    </FanMenu>
</div>
