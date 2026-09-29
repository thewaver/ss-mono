<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import { Button, ParticleSpawner } from "@thewaver/ss-components-svelte";
    import type { ParticleSpawnIterationPattern } from "@thewaver/ss-components-svelte";
    import { computeParticleGlow } from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleSpawnerPage/ParticleSpawnerPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ParticleSpawnerExampleProps } from "../ParticleSpawnerPage.types";

    const ONE_ROUND: ParticleSpawnIterationPattern[] = [{ count: 1 }];

    const TARGET_POSITIONS = [
        { left: "50%", top: "15%" },
        { left: "80%", top: "30%" },
        { left: "80%", top: "70%" },
        { left: "50%", top: "85%" },
        { left: "20%", top: "70%" },
        { left: "20%", top: "30%" },
    ];

    let { playback: _playback, ...props }: ParticleSpawnerExampleProps = $props();

    let playback = $state(false);

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

    <div class={styles.burstRoot} style:left={"50%"} style:top={"50%"}>
        <Button
            id={"particleBurst"}
            onClick={() => {
                playback = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Burst</PageButtonContent>
            {/snippet}
        </Button>

        <div class={styles.spawnerOverlay}>
            <ParticleSpawner
                {...props}
                bind:playback
                spawnIterationPatterns={ONE_ROUND}
                targets={targetRefs}
                onAnimationEnd={() => {
                    playback = false;
                }}
            >
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
</div>
