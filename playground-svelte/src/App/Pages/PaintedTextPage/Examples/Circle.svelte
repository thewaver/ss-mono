<script lang="ts">
    import { Button, PaintedText, PaintedTextUtils } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextCircleExampleProps } from "../PaintedTextPage.types";

    const RING_TEXT = "PAINTED TEXT • ROUND A CIRCLE • ";

    type Props = PaintedTextCircleExampleProps;

    let { progress = $bindable(), playback = $bindable(), ...props }: Props = $props();

    const id = $props.id();

    const path = $derived(PaintedTextUtils.computeCirclePath({ x: props.radius, y: props.radius }, props.radius));
</script>

<div class={styles.stack}>
    <PageMeasureBox padding={MEASURE_BOX_PADDING}>
        <div class={styles.ringText}>
            <PaintedText
                {path}
                isFittedToPath={props.isFittedToPath}
                lapDurationMs={props.lapDurationMs}
                bind:progress
                bind:playback
                computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                strokeWidth={props.strokeWidth}
                strokeAlignment={props.strokeAlignment}
            >
                {RING_TEXT}
            </PaintedText>
        </div>
    </PageMeasureBox>

    <div class={styles.buttonRow}>
        <Button
            id={"circlePlayback"}
            ariaLabel={playback ? "Pause" : "Play"}
            onClick={() => {
                playback = !playback;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={playback ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
            {/snippet}
        </Button>
    </div>
</div>
