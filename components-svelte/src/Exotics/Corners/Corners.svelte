<script lang="ts">
    import type { Snippet } from "svelte";

    import { CORNERS_DEFAULTS, CornerUtils, CornersStyles as styles } from "@thewaver/ss-components";

    import { toStyle } from "../../Utils/styleUtils.js";
    import type { CornersProps } from "./Corners.types.js";

    const DEFAULT_COLOR = "currentColor";

    let props: CornersProps & { children?: Snippet } = $props();

    const color = $derived(props.color ?? DEFAULT_COLOR);
    const transitionDurationMs = $derived(props.transitionDurationMs ?? CORNERS_DEFAULTS.transitionDurationMs);
    const cornerLength = $derived(props.cornerLength ?? CORNERS_DEFAULTS.cornerLength);
    const strokeThickness = $derived(props.strokeThickness ?? CORNERS_DEFAULTS.strokeThickness);
    const visibleCorners = $derived([...(props.visibleCorners ?? CORNERS_DEFAULTS.visibleCorners)]);
    const armPoints = $derived(CornerUtils.computeArmPoints(cornerLength, strokeThickness));
</script>

<div class={styles.cornersRoot}>
    <div
        class={styles.cornersGlow}
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
