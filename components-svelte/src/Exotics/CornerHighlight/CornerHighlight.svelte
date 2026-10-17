<script lang="ts">
    import type { Snippet } from "svelte";

    import { CORNER_HIGHLIGHT_DEFAULTS, CornerUtils, CornerHighlightStyles as styles } from "@thewaver/ss-components";
    import { CornerHighlightConst } from "@thewaver/ss-components/internal";

    import { toStyle } from "../../Utils/styleUtils.js";
    import type { CornerHighlightProps } from "./CornerHighlight.types.js";

    let props: CornerHighlightProps & { children?: Snippet } = $props();

    const color = $derived(props.color ?? CornerHighlightConst.DEFAULT_COLOR);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CORNER_HIGHLIGHT_DEFAULTS.transitionDurationMs);
    const cornerLength = $derived(props.cornerLength ?? CORNER_HIGHLIGHT_DEFAULTS.cornerLength);
    const strokeThickness = $derived(props.strokeThickness ?? CORNER_HIGHLIGHT_DEFAULTS.strokeThickness);
    const visibleCorners = $derived([...(props.visibleCorners ?? CORNER_HIGHLIGHT_DEFAULTS.visibleCorners)]);
    const armPoints = $derived(CornerUtils.computeArmPoints(cornerLength, strokeThickness));
</script>

<div class={styles.cornerHighlightRoot}>
    <div
        class={styles.cornerHighlightGlow}
        style={toStyle(CornerUtils.computeGlowStyle(color, transitionDurationMs))}
        aria-hidden="true"
    >
        {#each visibleCorners as cornerKey (cornerKey)}
            <svg
                class={[styles.cornerSVG, styles.cornerVariant[cornerKey]]}
                width={cornerLength.width}
                height={cornerLength.height}
                viewBox={`0 0 ${cornerLength.width} ${cornerLength.height}`}
                overflow="visible"
            >
                <polygon fill="currentColor" points={armPoints} />
            </svg>
        {/each}
    </div>

    {@render props.children?.()}
</div>
