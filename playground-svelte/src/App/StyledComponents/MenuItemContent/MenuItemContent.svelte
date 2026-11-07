<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuItemContent/MenuItemContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { MenuItemContentProps } from "./MenuItemContentSvelte.types";
    import {
        CHECKED_MARK,
        PICKED_MARK,
        SUBMENU_MARK,
    } from "@thewaver/ss-playground/App/StyledComponents/MenuItemContent/MenuItemContent.const";

    let props: MenuItemContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.menuItemContent,
        layerClass,
        props.hasHoverFloater && styles.hasHoverFloater,
        props.hasSelectionFloater && styles.hasSelectionFloater,
        (props.flags.isHovered || props.flags.isHighlighted || props.flags.isOpen) && styles.isHovered,
        props.flags.isActive && styles.isActive,
        props.flags.isDisabled && styles.isDisabled,
    ]}
>
    {#if props.kind !== undefined && props.kind !== "command"}
        <div class={styles.menuItemMark} aria-hidden="true">
            {props.flags.isChecked ? (props.kind === "radio" ? PICKED_MARK : CHECKED_MARK) : ""}
        </div>
    {/if}<div>{@render props.children?.()}</div>{#if props.shortcut}
        <div class={styles.menuItemShortcut}>{props.shortcut}</div>
    {/if}{#if props.flags.hasSubmenu}
        <div class={styles.menuItemSubmenuMark} aria-hidden="true">
            {SUBMENU_MARK}
        </div>
    {/if}
</div>
