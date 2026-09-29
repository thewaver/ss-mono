<script lang="ts">
    import { ParticleSpawner } from "@thewaver/ss-components-svelte";
    import type { ParticleSpawnerController } from "@thewaver/ss-components-svelte";
    import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const RETURN_COUNT = 1;

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    let outboundMarker = $state<HTMLElement>();
    let returnMarker = $state<HTMLElement>();
    let relay = $state.raw<ParticleSpawnerController>();
    let relayPlayback = $state(false);
</script>

{#snippet renderParticleAt(t: number, particleClass: string)}
    {@const glow = computeParticleGlow(t)}
    <div class={particleClass} style:opacity={glow.opacity} style:transform={`scale(${glow.scale})`}></div>
{/snippet}

<div class={styles.demoArea}>
    <div class={styles.spawnerRoot} style:left={"15%"} style:top={"50%"}>
        <div bind:this={outboundMarker} class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback
            targets={[returnMarker ?? undefined]}
            onParticleArrive={() => relay?.emit(RETURN_COUNT)}
        >
            {#snippet renderParticle(_index, t)}
                {@render renderParticleAt(t, styles.particle)}
            {/snippet}
        </ParticleSpawner>
    </div>

    <div class={styles.spawnerRoot} style:left={"85%"} style:top={"50%"}>
        <div bind:this={returnMarker} class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback={relayPlayback}
            targets={[outboundMarker ?? undefined]}
            onMount={(controller) => {
                relay = controller;
            }}
        >
            {#snippet renderParticle(_index, t)}
                {@render renderParticleAt(t, styles.particleReturn)}
            {/snippet}
        </ParticleSpawner>
    </div>
</div>
