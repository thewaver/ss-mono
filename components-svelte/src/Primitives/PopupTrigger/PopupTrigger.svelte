<script lang="ts">
    import { PopupTriggerStyles as styles } from "@thewaver/ss-components";

    import type { PopupTriggerProps } from "./PopupTrigger.types.js";

    let props: PopupTriggerProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<button
    {@attach props.attachElement}
    id={props.id}
    type="button"
    class={styles.popupTrigger}
    aria-label={props.ariaLabel}
    aria-haspopup="dialog"
    aria-expanded={props.isOpen}
    aria-controls={props.isOpen ? props.popupId : undefined}
    aria-disabled={isDisabled || undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onToggle();
    }}
>
    {@render props.renderContent(props.flags)}
</button>
