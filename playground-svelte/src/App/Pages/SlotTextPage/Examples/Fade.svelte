<script lang="ts">
    import type { Snippet } from "svelte";

    import type { SlotTextSlotFlags } from "@thewaver/ss-components-svelte";
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/SlotTextPage/SlotTextPage.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    type FadeProps = {
        className: string;
        flags: SlotTextSlotFlags;
        durationMs: number;
    };

    let props: FadeProps & { children?: Snippet } = $props();
</script>

<div
    class={[props.className, props.flags.isEntering && styles.isEntering, props.flags.isLeaving && styles.isLeaving]}
    style={toStyle(assignInlineVars({ [styles.fadeDurationVar]: `${props.durationMs}ms` }))}
>
    {@render props.children?.()}
</div>
