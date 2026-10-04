<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/MenuItemContent/MenuItemContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { MenuItemContentProps } from "./MenuItemContent.types";

    const SUBMENU_MARK = "›";
    const CHECKED_MARK = "✓";
    const PICKED_MARK = "●";

    let props: MenuItemContentProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.menuItemContent,
        layerClass,
        !props.isGliding && props.flags.isHovered && styles.isHovered,
        props.flags.isActive && styles.isActive,
        !props.isGliding && props.flags.isHighlighted && styles.isHighlighted,
        props.flags.isOpen && styles.isOpen,
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
