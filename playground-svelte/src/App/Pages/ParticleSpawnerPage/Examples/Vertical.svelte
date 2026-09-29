<script lang="ts">
    import { ParticleSpawner } from "@thewaver/ss-components-svelte";
    import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    let targetRef = $state<HTMLElement>();
</script>

<div class={styles.demoArea}>
    <div
        bind:this={targetRef}
        class={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]}
        style:left={"50%"}
        style:top={"85%"}
    ></div>

    <div class={styles.spawnerRoot} style:left={"50%"} style:top={"15%"}>
        <div class={styles.spawnerMarker}></div>

        <ParticleSpawner {...props} bind:playback targets={[targetRef ?? undefined]}>
            {#snippet renderParticle(_index, t)}
                {@const glow = computeParticleGlow(t)}
                <div
                    class={styles.particle}
                    style:opacity={glow.opacity}
                    style:transform={`scale(${glow.scale})`}
                ></div>
            {/snippet}
        </ParticleSpawner>
    </div>
</div>
