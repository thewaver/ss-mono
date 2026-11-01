<script lang="ts">
    import { type ParticleRouteStop, ParticleSpawner } from "@thewaver/ss-components-svelte";
    import {
        computeParticleAnimation,
        createLegTints,
        createTintableParticleSrc,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const OUT_AND_BACK: ParticleRouteStop[] = [0, "spawner"];

    let { playback = $bindable(), progress = $bindable(0), ...props }: ParticleSpawnerExampleProps = $props();

    const particleSrc = createTintableParticleSrc();
    const legTints = createLegTints();

    let targetRef = $state<HTMLElement>();
</script>

<div class={styles.demoArea}>
    <div
        bind:this={targetRef}
        class={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]}
        style:left={"85%"}
        style:top={"50%"}
    ></div>

    <div class={styles.spawnerRoot} style:left={"15%"} style:top={"50%"}>
        <div class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback
            bind:progress
            targets={[targetRef ?? undefined]}
            src={particleSrc}
            computeRoute={() => OUT_AND_BACK}
            computeParticleTint={(defs) => legTints[defs.legIndex % legTints.length]}
            {computeParticleAnimation}
        />
    </div>
</div>
