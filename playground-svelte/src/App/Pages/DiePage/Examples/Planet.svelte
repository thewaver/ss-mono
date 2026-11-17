<script lang="ts">
    import { Button, Die } from "@thewaver/ss-components-svelte";
    import type { DieController } from "@thewaver/ss-components-svelte";
    import {
        ICON_CLOUD_EMPTY_LABEL,
        PLANET_ICONS,
        PLANET_STEPS,
    } from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/DiePage/DiePage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageDieCore from "../../../StyledComponents/DieContent/PageDieCore.svelte";
    import PageDieIcon from "../../../StyledComponents/DieContent/PageDieIcon.svelte";
    import type { PlanetExampleProps } from "../DiePage.types";
    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";

    type Props = PlanetExampleProps;

    let { face = $bindable(), autoSpin = $bindable(), ...props }: Props = $props();

    let controller = $state.raw<DieController>();
</script>

<div class={styles.stage}>
    <PageMeasureBox>
        <Die
            shape={props.shape}
            size={props.size}
            idleDelayMs={props.idleDelayMs}
            settleDurationMs={props.settleDurationMs}
            momentumMs={props.momentumMs}
            bind:face
            bind:autoSpin
            isMovable={true}
            isSeeThrough={true}
            ariaLabel={"A planet circled by icons"}
            computeFaceLabel={(index) => PLANET_ICONS[index]?.label ?? ICON_CLOUD_EMPTY_LABEL}
            onMount={(next) => {
                controller = next;
            }}
        >
            {#snippet renderFace(index, state)}
                <PageDieIcon {state} icon={PLANET_ICONS[index]?.icon ?? ""} />
            {/snippet}

            {#snippet renderCore()}
                <PageDieCore />
            {/snippet}
        </Die>
    </PageMeasureBox>

    <div class={styles.controls}>
        <Button
            id={"diePlanetPlayback"}
            ariaLabel={autoSpin ? "Pause" : "Play"}
            onClick={() => {
                autoSpin = !autoSpin;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={autoSpin ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>

        {#each PLANET_STEPS as step (step.direction)}
            <Button
                id={step.id}
                ariaLabel={step.label}
                onClick={() => {
                    controller?.step(step.direction);
                }}
            >
                {#snippet renderContent(flags)}
                    <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS[step.direction]} />
                {/snippet}
            </Button>
        {/each}
    </div>
</div>
