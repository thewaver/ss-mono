<script lang="ts" generics="T">
    import { BARREL_DEFAULTS, type BarrelFace, BarrelUtils, BarrelStyles as styles } from "@thewaver/ss-components";

    import type { BarrelProps } from "./Barrel.types.js";

    let props: BarrelProps<T> = $props();

    const toMs = (value: number | undefined) => (value === undefined ? undefined : `${value}ms`);

    const axis = $derived(props.axis ?? BARREL_DEFAULTS.axis);
    const faceSize = $derived(props.faceSize ?? BARREL_DEFAULTS.faceSize);
    const faceCount = $derived(props.faces.length);

    const faceExtent = $derived(BarrelUtils.getFaceExtent(faceSize, axis));
    const apothem = $derived(BarrelUtils.getApothem(faceExtent, faceCount));
    const girth = $derived(BarrelUtils.getGirth(faceExtent, faceCount));
    const rootSize = $derived(BarrelUtils.getRootSize(faceSize, axis, girth));
    const hasBacks = $derived(props.hasBacks ?? BarrelUtils.getHasBacks(faceCount));
</script>

{#snippet barrelFace(item: T, index: number, face: BarrelFace)}
    {@const defs = props.computeFaceDefs(index, face)}
    <div
        class={styles.barrelFace}
        style:transform={BarrelUtils.getFaceTransform(axis, face, props.angle, index, faceCount, apothem)}
        style:transition-duration={toMs(props.transitionDurationMs)}
        style:transition-delay={toMs(props.transitionDelayMs)}
        role="group"
        aria-roledescription={props.faceRoleDescription}
        aria-label={defs.ariaLabel}
        aria-hidden={defs.isHidden ? "true" : undefined}
        inert={defs.isHidden}
    >
        {@render props.renderFace(item, index, face)}
    </div>
{/snippet}

<div class={styles.barrelRoot} style:width={`${rootSize.width}px`} style:height={`${rootSize.height}px`}>
    <div
        class={styles.barrelPerspective}
        style:width={`${faceSize.width}px`}
        style:height={`${faceSize.height}px`}
        style:perspective={`${BarrelUtils.PERSPECTIVE_PX}px`}
    >
        <div class={styles.barrelBody} style:transform={`translateZ(${-apothem}px)`}>
            {#each props.faces as item, index (index)}
                {@render barrelFace(item, index, "front")}

                {#if hasBacks}
                    {@render barrelFace(item, index, "back")}
                {/if}
            {/each}
        </div>
    </div>
</div>
