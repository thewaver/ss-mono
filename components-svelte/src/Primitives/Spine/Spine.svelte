<script lang="ts" generics="T">
    import { SPINE_DEFAULTS, type SpineSide, SpineUtils, SpineStyles as styles } from "@thewaver/ss-components";

    import type { SpineProps } from "./Spine.types.js";

    let props: SpineProps<T> = $props();

    const toMs = (value: number | undefined) => (value === undefined ? undefined : `${value}ms`);

    const axis = $derived(props.axis ?? SPINE_DEFAULTS.axis);
    const faceCount = $derived(props.faces.length);
    const hasBacks = $derived(props.hasBacks ?? SPINE_DEFAULTS.hasBacks);
    const perspectivePx = $derived(props.perspectivePx ?? SPINE_DEFAULTS.perspectivePx);
</script>

{#snippet spineFace(item: T, index: number, side: SpineSide)}
    {@const distance = SpineUtils.getDistance(index, props.position)}
    {@const angle = props.computeFaceAngle({ distance, index, count: faceCount })}
    {@const defs = props.computeFaceDefs(index, side, angle)}
    <div
        class={styles.spineFace}
        style:transform={SpineUtils.getFaceTransform(axis, side, angle, SpineUtils.getStackOffset(distance, faceCount))}
        style:transition-duration={toMs(props.transitionDurationMs)}
        style:transition-delay={toMs(props.transitionDelayMs)}
        role="group"
        aria-roledescription={props.faceRoleDescription}
        aria-label={defs.ariaLabel}
        aria-hidden={defs.isHidden ? "true" : undefined}
        inert={defs.isHidden}
    >
        {@render props.renderFace(item, index, side)}
    </div>
{/snippet}

<div
    class={styles.spineRoot}
    style:width={props.faceSize === undefined ? undefined : `${props.faceSize.width}px`}
    style:height={props.faceSize === undefined ? undefined : `${props.faceSize.height}px`}
    style:perspective={`${perspectivePx}px`}
>
    <div class={styles.spineBody}>
        {#each props.faces as item, index (index)}
            {@render spineFace(item, index, "front")}

            {#if hasBacks}
                {@render spineFace(item, index, "back")}
            {/if}
        {/each}
    </div>
</div>
