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

    const SPAWNER_TOPS = ["20%", "50%", "80%"];
    const TARGET_TOPS = ["20%", "50%", "80%"];

    let { playback = $bindable(), progress = $bindable(0), ...props }: ParticleSpawnerExampleProps = $props();

    const followers = SPAWNER_TOPS.map((_, index) => (index === 0 ? undefined : props.takeProgress?.()));

    const getProgressAt = (index: number) => followers[index]?.value ?? progress;

    const setProgressAt = (index: number, value: number) => {
        const follower = followers[index];

        if (follower) {
            follower.value = value;
        } else {
            progress = value;
        }
    };

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
            style:left={"90%"}
            style:top={top}
        ></div>
    {/each}

    {#each SPAWNER_TOPS as top, index (index)}
        <div class={styles.spawnerRoot} style:left={"10%"} style:top={top}>
            <div class={styles.spawnerMarker}></div>

            <ParticleSpawner
                {...props}
                bind:playback
                bind:progress={() => getProgressAt(index), (value) => setProgressAt(index, value)}
                targets={targetRefs}
                src={particleSrc}
                {computeParticleAnimation}
            />
        </div>
    {/each}
</div>
