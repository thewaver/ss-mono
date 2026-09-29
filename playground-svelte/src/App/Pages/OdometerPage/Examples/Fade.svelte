<script lang="ts">
    import type { Snippet } from "svelte";

    import type { OdometerSlotFlags } from "@thewaver/ss-components-svelte";
    import { toStyle } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/OdometerPage/OdometerPage.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    type FadeProps = {
        className: string;
        flags: OdometerSlotFlags;
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
