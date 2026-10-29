<script lang="ts">
    import { ParticleDissolve } from "@thewaver/ss-components-svelte";
    import {
        ASH_ANIMATION,
        ASH_SRC,
        CARD_TEXT,
        STRESS_CELL_SIZE,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
    import { onMount } from "svelte";

    import type { ParticleDissolveExampleProps } from "./ParticleDissolvePageSvelte.types";

    type Props = ParticleDissolveExampleProps & { isOnGraphicsCard: boolean };

    let props: Props = $props();

    let isDissolved = $state(false);

    onMount(() => {
        const timeout = setTimeout(() => {
            isDissolved = true;
        });

        return () => clearTimeout(timeout);
    });
</script>

<ParticleDissolve
    src={ASH_SRC}
    {isDissolved}
    durationMs={props.durationMs}
    particleLifetimeMs={props.particleLifetimeMs}
    featherShare={props.featherShare}
    spawnChance={props.spawnChance}
    cellSize={STRESS_CELL_SIZE}
    renderer={props.isOnGraphicsCard ? "graphics_card" : "elements"}
    computeParticleAnimation={ASH_ANIMATION}
    onDissolveEnd={() => {
        isDissolved = false;
    }}
    onRebuildEnd={() => {
        isDissolved = true;
    }}
>
    <div class={styles.card}>
        <span class={styles.cardTitle}>{CARD_TEXT.title}</span>
        <span>{CARD_TEXT.body}</span>
        <span class={styles.badge}>{CARD_TEXT.badge}</span>
    </div>
</ParticleDissolve>
