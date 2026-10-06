<script lang="ts">
    import { Button, PaintedText } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextPathExampleProps } from "../PaintedTextPage.types";

    const WAVE_PATH = "M 0 60 C 45 0 90 0 135 60 S 225 120 270 60 S 360 0 405 60 S 495 120 540 60";
    const WAVE_TEXT = "Riding the wave, round and round • ";

    type Props = PaintedTextPathExampleProps;

    let { progress = $bindable(), playback = $bindable(), ...props }: Props = $props();

    const id = $props.id();
</script>

<div class={styles.stack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <div class={styles.waveText}>
            <PaintedText
                path={WAVE_PATH}
                lapDurationMs={props.lapDurationMs}
                bind:progress
                bind:playback
                computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                strokeWidth={props.strokeWidth}
                strokeAlignment={props.strokeAlignment}
            >
                {WAVE_TEXT}
            </PaintedText>
        </div>
    </PageMeasureBox>

    <div class={styles.buttonRow}>
        <Button
            id={"wavePlayback"}
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
