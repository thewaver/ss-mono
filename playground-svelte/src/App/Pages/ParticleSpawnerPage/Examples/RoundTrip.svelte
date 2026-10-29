<script lang="ts">
    import { ParticleSpawner } from "@thewaver/ss-components-svelte";
    import type { ParticleSpawnerController } from "@thewaver/ss-components-svelte";
    import {
        computeParticleAnimation,
        createParticleSrc,
        createReturnParticleSrc,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const RETURN_COUNT = 1;

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    const particleSrc = createParticleSrc();
    const returnParticleSrc = createReturnParticleSrc();

    let outboundMarker = $state<HTMLElement>();
    let returnMarker = $state<HTMLElement>();
    let relay = $state.raw<ParticleSpawnerController>();
    let relayPlayback = $state(false);
</script>

<div class={styles.demoArea}>
    <div class={styles.spawnerRoot} style:left={"15%"} style:top={"50%"}>
        <div bind:this={outboundMarker} class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback
            targets={[returnMarker ?? undefined]}
            src={particleSrc}
            {computeParticleAnimation}
            onParticleArrive={() => relay?.emit(RETURN_COUNT)}
        />
    </div>

    <div class={styles.spawnerRoot} style:left={"85%"} style:top={"50%"}>
        <div bind:this={returnMarker} class={styles.spawnerMarkerReturn}></div>

        <ParticleSpawner
            {...props}
            bind:playback={relayPlayback}
            targets={[outboundMarker ?? undefined]}
            src={returnParticleSrc}
            {computeParticleAnimation}
            onMount={(controller) => {
                relay = controller;
            }}
        />
    </div>
</div>
