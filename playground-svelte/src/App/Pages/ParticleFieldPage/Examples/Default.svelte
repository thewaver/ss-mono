<script lang="ts">
    import {
        CellAnimationKeyframes,
        CellAnimationOrigins,
        SliceAnimationWeights,
        ParticleField,
        type ParticleFieldProps,
    } from "@thewaver/ss-components-svelte";
    import { ParticlePictureUtils } from "@thewaver/ss-playground/App/PageComponents/ParticlePicture/ParticlePicture.utils";
    import {
        computeParticlePos,
        createEnvelope,
    } from "@thewaver/ss-playground/App/Pages/ParticleFieldPage/ParticleFieldPage.const";
    import { themeVars } from "@thewaver/ss-playground/App/Theme.css";
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
    }: ParticleFieldExampleProps &
        Pick<ParticleFieldProps, "computeShapePoints" | "shapeJoinRadii" | "progress" | "renderer"> = $props();

    const src = ParticlePictureUtils.createDotSrc(themeVars.color.success.light, themeVars.color.success.dark);

    const origin = $derived(CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount));

    const animation = $derived(createEnvelope(CellAnimationKeyframes.SAMPLE_ANIMATIONS[animationType], holdShare));

    const computeCellWeights = $derived((count: Index2d) =>
        SliceAnimationWeights.computeSliceWeights(weightType, count, CellAnimationOrigins.computeOrigin(originType, count)),
    );
</script>

<ParticleField
    {...otherProps}
    bind:playback
    bind:progress
    {src}
    {origin}
    {computeCellWeights}
    computeParticlePos={(defs) => computeParticlePos(defs.rect, isScattered)}
    computeParticleAnimation={animation}
/>
