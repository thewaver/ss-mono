<script lang="ts">
    import { MenuUtils, MenuStyles as styles } from "@thewaver/ss-components";

    import type { MenuItemViewProps } from "./Menu.types.js";

    let props: MenuItemViewProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const hasSubmenu = $derived(props.flags.hasSubmenu);
    const isOpen = $derived(props.flags.isOpen);
</script>

<div
    {@attach props.attachElement}
    id={props.id}
    class={[styles.menuItem, props.isRegion && styles.menuItemRegion]}
    role={MenuUtils.getItemRole(props.kind)}
    aria-label={props.ariaLabel || undefined}
    aria-disabled={isDisabled || undefined}
    aria-checked={props.kind === "command" ? undefined : props.flags.isChecked}
    aria-haspopup={hasSubmenu ? "menu" : undefined}
    aria-expanded={hasSubmenu ? isOpen : undefined}
    aria-controls={isOpen ? props.submenuId : undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onActivate();
    }}
    onmouseenter={(e) => props.onHover({ x: e.clientX, y: e.clientY })}
>
    {@render props.renderContent(props.flags)}
</div>
