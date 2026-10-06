<script lang="ts">
    import { Button, PaintedText, ScrambleText } from "@thewaver/ss-components-svelte";
    import type { ScrambleTextController } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

    let props: PaintedTextBoxedExampleProps = $props();

    const id = $props.id();

    let controller: ScrambleTextController | undefined;
</script>

<div class={styles.stack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <div class={[styles.fill, styles.typedHeading]}>
            <ScrambleText
                settleDurationMs={1800}
                onMount={(next) => {
                    controller = next;
                }}
            >
                <PaintedText
                    computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                    computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                    strokeWidth={props.strokeWidth}
                    strokeAlignment={props.strokeAlignment}
                >
                    Build 1.4.3 ready
                </PaintedText>
            </ScrambleText>
        </div>
    </PageMeasureBox>

    <Button
        id={"scrambleAgain"}
        ariaLabel={"Scramble it again"}
        onClick={() => {
            controller?.restartAnimation();
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
        {/snippet}
    </Button>
</div>
