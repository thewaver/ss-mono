<script lang="ts">
    import { CollapsibleStyles as styles } from "@thewaver/ss-components";

    import type { CollapsibleTriggerProps } from "./Collapsible.types.js";

    let props: CollapsibleTriggerProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<button
    {@attach props.attachElement}
    id={props.id}
    type="button"
    class={styles.collapsibleTrigger}
    aria-expanded={props.isExpanded}
    aria-controls={props.panelId}
    aria-disabled={isDisabled || undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onToggle();
    }}
>
    {@render props.renderTrigger(props.flags)}
</button>
