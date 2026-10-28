<script lang="ts">
    import { Button, ParticleDissolve } from "@thewaver/ss-components-svelte";
    import {
        CARD_TEXT,
        computeAshAnimation,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import AshParticle from "../AshParticle.svelte";
    import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageSvelte.types";

    type Props = ParticleDissolveAngleExampleProps;

    let props: Props = $props();

    let isDissolved = $state(false);
</script>

<div id={"particleDissolveCardStage"} class={styles.stack}>
    <ParticleDissolve
        {isDissolved}
        angleDegrees={props.angleDegrees}
        durationMs={props.durationMs}
        particleLifetimeMs={props.particleLifetimeMs}
        featherShare={props.featherShare}
        spawnChance={props.spawnChance}
        cellSize={props.cellSize}
        computeParticleAnimation={computeAshAnimation}
    >
        <div class={styles.card}>
            <span id={"particleDissolveCardTitle"} class={styles.cardTitle}>{CARD_TEXT.title}</span>
            <span>{CARD_TEXT.body}</span>
            <span id={"particleDissolveCardBadge"} class={styles.badge}>{CARD_TEXT.badge}</span>
        </div>

        {#snippet renderParticle(defs)}
            <AshParticle {defs} />
        {/snippet}
    </ParticleDissolve>

    <div class={styles.buttonRow}>
        <Button
            id={"particleDissolveCardBurn"}
            onClick={() => {
                isDissolved = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Dissolve</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"particleDissolveCardRebuild"}
            onClick={() => {
                isDissolved = false;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Rebuild</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
