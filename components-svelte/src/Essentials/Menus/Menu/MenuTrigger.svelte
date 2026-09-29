<script lang="ts">
    import { MenuStyles as styles } from "@thewaver/ss-components";

    import { LabelSvelteUtils } from "../../Input/Label/LabelSvelte.utils.svelte.js";
    import type { MenuTriggerProps } from "./Menu.types.js";

    let props: MenuTriggerProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const isOpen = $derived(props.flags.isOpen);
</script>

<button
    {@attach props.attachElement}
    id={props.id}
    type="button"
    class={[styles.menuTrigger, props.isHoldable && styles.menuTriggerHoldable]}
    role={props.role}
    aria-haspopup="menu"
    aria-label={getAriaLabel()}
    aria-disabled={isDisabled || undefined}
    aria-expanded={isOpen}
    aria-controls={isOpen ? props.menuId : undefined}
    onpointerdown={(e) => {
        if (isDisabled) return;

        props.onPress(e);
    }}
    onclick={() => {
        if (isDisabled) return;

        props.onToggle();
    }}
    onkeydown={(e) => props.onKeyDown(e)}
>
    {@render props.renderContent(props.flags)}
</button>
