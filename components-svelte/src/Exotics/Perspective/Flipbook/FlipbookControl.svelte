<script lang="ts">
    import { FlipbookStyles as styles } from "@thewaver/ss-components";

    import type { FlipbookControlProps } from "./Flipbook.types.js";

    let props: FlipbookControlProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<button
    {@attach props.attachElement}
    type="button"
    class={styles.flipbookControl}
    aria-label={props.ariaLabel}
    aria-disabled={isDisabled || undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onActivate();
    }}
>
    {@render props.renderContent(props.flags)}
</button>
