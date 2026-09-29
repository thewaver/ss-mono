<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import { ParticleSpawner } from "@thewaver/ss-components-svelte";
    import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const TARGET_POSITIONS = [
        { left: "50%", top: "15%" },
        { left: "80%", top: "30%" },
        { left: "80%", top: "70%" },
        { left: "50%", top: "85%" },
        { left: "20%", top: "70%" },
        { left: "20%", top: "30%" },
    ];

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    let targetRefs = $state.raw<(HTMLElement | undefined)[]>(TARGET_POSITIONS.map(() => undefined));

    const setTarget = (index: number, element: HTMLElement | undefined) => {
        untrack(() => {
            targetRefs = targetRefs.map((ref, refIndex) => (refIndex === index ? element : ref));
        });
    };

    const attachTarget =
        (index: number): Attachment<HTMLElement> =>
        (element) => {
            setTarget(index, element);

            return () => setTarget(index, undefined);
        };
</script>

<div class={styles.demoArea}>
    {#each TARGET_POSITIONS as position, index (index)}
        <div
            {@attach attachTarget(index)}
            class={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]}
            style:left={position.left}
            style:top={position.top}
        ></div>
    {/each}

    <div class={styles.spawnerRoot} style:left={"50%"} style:top={"50%"}>
        <div class={styles.spawnerMarker}></div>

        <ParticleSpawner {...props} bind:playback targets={targetRefs}>
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
