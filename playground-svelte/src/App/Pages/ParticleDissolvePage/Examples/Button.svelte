<script lang="ts">
    import { Button, ParticleDissolve } from "@thewaver/ss-components-svelte";
    import {
        CENTER_SHARE,
        computeAshAnimation,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
    import type { Point2d } from "@thewaver/ss-utils";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import AshParticle from "../AshParticle.svelte";
    import type { ParticleDissolveExampleProps } from "../ParticleDissolvePageSvelte.types";

    type Props = ParticleDissolveExampleProps;

    const computePressShare = (e: MouseEvent | KeyboardEvent): Point2d => {
        const element = e.currentTarget;

        if (!(e instanceof MouseEvent) || e.detail === 0 || !(element instanceof HTMLElement)) return CENTER_SHARE;

        const rect = element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) return CENTER_SHARE;

        return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
    };

    let props: Props = $props();

    let isDissolved = $state(false);
    let originShare = $state.raw<Point2d>(CENTER_SHARE);
</script>

<div id={"particleDissolveButtonStage"} class={styles.stack}>
    <ParticleDissolve
        {isDissolved}
        {originShare}
        durationMs={props.durationMs}
        particleLifetimeMs={props.particleLifetimeMs}
        featherShare={props.featherShare}
        spawnChance={props.spawnChance}
        particlesPerCell={props.particlesPerCell}
        cellSize={props.cellSize}
        computeParticleAnimation={computeAshAnimation}
    >
        <Button
            id={"particleDissolveBurn"}
            onClick={(e) => {
                originShare = computePressShare(e);
                isDissolved = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Burn me</PageButtonContent>
            {/snippet}
        </Button>

        {#snippet renderParticle(defs)}
            <AshParticle {defs} />
        {/snippet}
    </ParticleDissolve>

    <Button
        id={"particleDissolveRebuild"}
        onClick={() => {
            isDissolved = false;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Rebuild</PageButtonContent>
        {/snippet}
    </Button>
</div>
