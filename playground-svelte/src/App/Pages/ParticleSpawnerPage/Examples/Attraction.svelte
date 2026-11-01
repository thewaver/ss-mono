<script lang="ts">
    import { ParticleModifierUtils, ParticleSpawner } from "@thewaver/ss-components-svelte";
    import {
        computeParticleAnimation,
        createParticleSrc,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { AttractionExampleProps } from "../ParticleSpawnerPage.types";

    let {
        playback = $bindable(),
        progress = $bindable(0),
        attractionStrengthRatio,
        attractionReachPixels,
        ...props
    }: AttractionExampleProps = $props();

    const particleSrc = createParticleSrc();

    let targetRef = $state<HTMLElement>();
    let attractorRef = $state<HTMLElement>();

    const modifiers = $derived([
        ParticleModifierUtils.createAttraction({
            modMarkerIndex: 0,
            strengthRatio: attractionStrengthRatio,
            reachPixels: attractionReachPixels,
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

    <div bind:this={attractorRef} class={styles.attractorMarker}></div>

    <div class={styles.spawnerRoot} style:left={"15%"} style:top={"50%"}>
        <div class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback
            bind:progress
            targets={[targetRef ?? undefined]}
            modMarkers={[attractorRef ?? undefined]}
            src={particleSrc}
            particleModifiers={modifiers}
            {computeParticleAnimation}
        />
    </div>
</div>
