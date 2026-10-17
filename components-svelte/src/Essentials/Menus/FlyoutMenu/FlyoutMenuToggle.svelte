<script lang="ts">
    import { type FlyoutMenuToggleFlags, FlyoutMenuStyles as styles } from "@thewaver/ss-components";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { FlyoutMenuToggleProps } from "./FlyoutMenu.types.js";

    let { ref = $bindable(), ...props }: FlyoutMenuToggleProps = $props();

    const extraFlags: FlyoutMenuToggleFlags = $derived({ isOpen: props.isOpen });
</script>

<InteractionWrapper bind:ref {extraFlags} onActivation={props.onPress}>
    {#snippet renderControl(attachElement, flags)}
        <button
            {@attach attachElement}
            type="button"
            class={styles.flyoutMenuToggle}
            aria-label={props.ariaLabel}
            aria-expanded={props.isOpen}
            aria-controls={props.isOpen ? props.controlsId : undefined}
            onkeydown={(e) => props.onKeyDown?.(e)}
        >
            {@render props.renderContent(flags)}
        </button>
    {/snippet}
</InteractionWrapper>
