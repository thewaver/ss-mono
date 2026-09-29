<script lang="ts">
    import { BUTTON_DEFAULTS, ButtonStyles as styles } from "@thewaver/ss-components";

    import { LabelSvelteUtils } from "../Input/Label/LabelSvelte.utils.svelte.js";
    import type { ButtonElementProps } from "./Button.types.js";

    let props: ButtonElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const isPending = $derived(props.flags.isPending);
    const isRefusing = $derived(isDisabled || isPending);
</script>

<button
    {@attach props.attachElement}
    id={props.id}
    type={props.type ?? BUTTON_DEFAULTS.type}
    class={styles.buttonElement}
    aria-label={getAriaLabel()}
    aria-disabled={isDisabled || undefined}
    aria-pressed={props.flags.isPressed}
    aria-busy={isPending || undefined}
    onclick={(e) => {
        if (isRefusing) {
            e.preventDefault();

            return;
        }

        void props.onClick?.(e);
    }}
    onpointerdown={(e) => {
        if (isRefusing) return;

        props.onPointerDown?.(e);
    }}
    onpointerup={(e) => {
        if (isRefusing) return;

        props.onPointerUp?.(e);
    }}
    onpointercancel={(e) => {
        if (isRefusing) return;

        props.onPointerUp?.(e);
    }}
    onmouseenter={(e) => {
        if (isDisabled) return;

        props.onMouseEnter?.(e);
    }}
    onmouseleave={(e) => {
        if (isDisabled) return;

        props.onMouseLeave?.(e);
    }}
>
    {@render props.renderContent(props.flags)}
</button>
