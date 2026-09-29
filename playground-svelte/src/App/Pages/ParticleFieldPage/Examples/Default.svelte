<script lang="ts">
    import {
        CellAnimationKeyframes,
        CellAnimationOrigins,
        CellAnimationWeights,
        ParticleField,
        type ParticleFieldProps,
    } from "@thewaver/ss-components-svelte";
    import {
        computeParticlePos,
        computeParticleTimeline,
    } from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.css";
    import type { Index2d } from "@thewaver/ss-utils";

    import type { ParticleFieldExampleProps } from "../ParticleFieldPage.types";

    let {
        originType,
        weightType,
        animationType,
        holdShare,
        isScattered,
        playback = $bindable(),
        progress = $bindable(0),
        ...otherProps
    }: ParticleFieldExampleProps & Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress"> =
        $props();

    const computeCellWeights = $derived((count: Index2d) =>
        CellAnimationWeights.computeCellWeights(weightType, count, CellAnimationOrigins.computeOrigin(originType, count)),
    );
</script>

<ParticleField
    {...otherProps}
    bind:playback
    bind:progress
    {computeCellWeights}
    computeParticlePos={(defs) => computeParticlePos(defs.rect, isScattered)}
    computeParticleAnimation={(defs, t) =>
        CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType](computeParticleTimeline(t, holdShare), {
            ...defs,
            origin: CellAnimationOrigins.computeOrigin(originType, defs.count),
        })}
>
    {#snippet renderParticle()}
        <div class={styles.particle}></div>
    {/snippet}
</ParticleField>
