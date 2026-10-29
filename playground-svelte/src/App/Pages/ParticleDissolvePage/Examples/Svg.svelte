<script lang="ts">
    import { Button, ParticleDissolve } from "@thewaver/ss-components-svelte";
    import {
        NO_EDGE_THICKNESSES,
        SVG_LABEL,
        SVG_SIZE,
        ASH_ANIMATION,
        ASH_SRC,
    } from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/ParticleDissolvePage/ParticleDissolvePage.css";
    import { ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import type { ParticleDissolveSvgExampleProps } from "../ParticleDissolvePageSvelte.types";

    type Props = ParticleDissolveSvgExampleProps;

    let props: Props = $props();

    let isDissolved = $state(false);

    const path = $derived(
        ShapeUtils.getPaths(ShapeConst.getDefaultShapePoints(props.shapeKind, SVG_SIZE), NO_EDGE_THICKNESSES).outerPath,
    );
</script>

<div id={"particleDissolveSvgStage"} class={styles.stack}>
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
        <svg
            class={styles.svgShape}
            width={SVG_SIZE.width}
            height={SVG_SIZE.height}
            role="img"
            aria-label={"The shape that dissolves"}
        >
            <path class={styles.svgShapePath} d={path} />
            <text class={styles.svgShapeText} x={"50%"} y={"50%"}>{SVG_LABEL}</text>
        </svg>
    </ParticleDissolve>

    <div class={styles.buttonRow}>
        <Button
            id={"particleDissolveSvgBurn"}
            onClick={() => {
                isDissolved = true;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Dissolve</PageButtonContent>
            {/snippet}
        </Button>
        <Button
            id={"particleDissolveSvgRebuild"}
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
