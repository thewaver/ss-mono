<script lang="ts">
    import { ParticleModifierUtils, ParticleSpawner } from "@thewaver/ss-components-svelte";
    import {
        computeParticleAnimation,
        createParticleSrc,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { WindExampleProps } from "../ParticleSpawnerPage.types";

    let {
        playback = $bindable(),
        progress = $bindable(0),
        windDirectionDegrees,
        windStrengthPixels,
        windGustRatio,
        ...props
    }: WindExampleProps = $props();

    const particleSrc = createParticleSrc();

    let targetRef = $state<HTMLElement>();

    const modifiers = $derived([
        ParticleModifierUtils.createWind({
            directionDegrees: windDirectionDegrees,
            strengthPixels: windStrengthPixels,
            gustRatio: windGustRatio,
        }),
    ]);
</script>

<div class={styles.demoArea}>
    <div
        bind:this={targetRef}
        class={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]}
        style:left={"85%"}
        style:top={"50%"}
    ></div>

    <div
        class={styles.windArrow}
        style:width={`${windStrengthPixels}px`}
        style:transform={`rotate(${windDirectionDegrees}deg)`}
    ></div>

    <div class={styles.spawnerRoot} style:left={"15%"} style:top={"50%"}>
        <div class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback
            bind:progress
            targets={[targetRef ?? undefined]}
            src={particleSrc}
            particleModifiers={modifiers}
            {computeParticleAnimation}
        />
    </div>
</div>
