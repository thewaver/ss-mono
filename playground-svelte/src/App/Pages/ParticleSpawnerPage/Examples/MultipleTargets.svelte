<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import { ParticleSpawner } from "@thewaver/ss-components-svelte";
    import {
        computeParticleAnimation,
        createParticleSrc,
    } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const TARGET_TOPS = ["20%", "40%", "60%", "80%"];

    let { playback = $bindable(), ...props }: ParticleSpawnerExampleProps = $props();

    const particleSrc = createParticleSrc();

    let targetRefs = $state.raw<(HTMLElement | undefined)[]>(TARGET_TOPS.map(() => undefined));

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
    {#each TARGET_TOPS as top, index (index)}
        <div
            {@attach attachTarget(index)}
            class={[styles.targetMarker, props.areTargetsHidden && styles.isHiddenMarker]}
            style:left={"85%"}
            style:top={top}
        ></div>
    {/each}

    <div class={styles.spawnerRoot} style:left={"15%"} style:top={"50%"}>
        <div class={styles.spawnerMarker}></div>

        <ParticleSpawner
            {...props}
            bind:playback
            targets={targetRefs}
            src={particleSrc}
            {computeParticleAnimation}
        />
    </div>
</div>
