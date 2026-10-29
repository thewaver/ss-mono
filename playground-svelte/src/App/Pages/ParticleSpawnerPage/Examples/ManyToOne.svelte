<script lang="ts">
    import { ParticleSpawner } from "@thewaver/ss-components-svelte";
    import {
        computeParticleAnimation,
        createParticleSrc,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const SPAWNER_POSITIONS = [
        { left: "50%", top: "15%" },
        { left: "80%", top: "30%" },
        { left: "80%", top: "70%" },
        { left: "50%", top: "85%" },
        { left: "20%", top: "70%" },
        { left: "20%", top: "30%" },
    ];

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    const particleSrc = createParticleSrc();

    let targetRef = $state<HTMLElement>();
</script>

<div class={styles.demoArea}>
    <div
        bind:this={targetRef}
        class={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]}
        style:left={"50%"}
        style:top={"50%"}
    ></div>

    {#each SPAWNER_POSITIONS as position, index (index)}
        <div class={styles.spawnerRoot} style:left={position.left} style:top={position.top}>
            <div class={styles.spawnerMarker}></div>

            <ParticleSpawner
                {...props}
                bind:playback
                targets={[targetRef ?? undefined]}
                src={particleSrc}
                {computeParticleAnimation}
            />
        </div>
    {/each}
</div>
