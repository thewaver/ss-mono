<script lang="ts">
    import { Button, ParticleDissolve } from "@thewaver/ss-components-svelte";
    import {
        CARD_TEXT,
        ASH_ANIMATION,
        ASH_SRC,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
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
        src={ASH_SRC}
        computeParticleAnimation={ASH_ANIMATION}
    >
        <div class={styles.card}>
            <span id={"particleDissolveCardTitle"} class={styles.cardTitle}>{CARD_TEXT.title}</span>
            <span>{CARD_TEXT.body}</span>
            <span id={"particleDissolveCardBadge"} class={styles.badge}>{CARD_TEXT.badge}</span>
        </div>
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
