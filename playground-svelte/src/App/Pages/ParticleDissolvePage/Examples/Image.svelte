<script lang="ts">
    import { Button, ParticleDissolve } from "@thewaver/ss-components-svelte";
    import { computeAshAnimation } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import AshParticle from "../AshParticle.svelte";
    import type { ParticleDissolveAngleExampleProps } from "../ParticleDissolvePageSvelte.types";

    type Props = ParticleDissolveAngleExampleProps;

    let props: Props = $props();

    let isDissolved = $state(false);
</script>

<div id={"particleDissolveImageStage"} class={styles.stack}>
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
        <img class={styles.image} src={knight} alt={"A knight"} />

        {#snippet renderParticle(defs)}
            <AshParticle {defs} />
        {/snippet}
    </ParticleDissolve>

    <div class={styles.buttonRow}>
        <Button
            id={"particleDissolveImageBurn"}
            onClick={() => {
                isDissolved = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Dissolve</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"particleDissolveImageRebuild"}
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
