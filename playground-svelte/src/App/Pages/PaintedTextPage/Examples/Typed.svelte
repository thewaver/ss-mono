<script lang="ts">
    import { Button, MediaQueryMonitorSvelteUtils, PaintedText, Typewriter } from "@thewaver/ss-components-svelte";
    import type { TypewriterController } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextBoxedExampleProps } from "../PaintedTextPage.types";

    type Props = PaintedTextBoxedExampleProps & {
        computeAnimationName: (character: string, index: number, count: number) => string;
    };

    let props: Props = $props();

    const id = $props.id();

    let controller: TypewriterController | undefined;

    let isBlinkStopped = $state(false);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();
</script>

<div class={styles.stack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <div class={styles.fill}>
            <Typewriter
                computeAnimationName={props.computeAnimationName}
                animationDelayMs={40}
                animationDurationMs={400}
                onMount={(next) => {
                    controller = next;
                }}
            >
                <div class={styles.typedHeading}>
                    <PaintedText
                        computeFillDefs={(size, element) => computeSampleDefs(props, "fill", id, size, element)}
                        computeStrokeDefs={(size, element) => computeSampleDefs(props, "stroke", id, size, element)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        Typed and painted
                    </PaintedText>
                </div>

                <div class={styles.paragraph}>
                    <PaintedText
                        computeFillDefs={(size, element) => computeSampleDefs(props, "fill", `${id}-body`, size, element)}
                        computeStrokeDefs={(size, element) =>
                            computeSampleDefs(props, "stroke", `${id}-body`, size, element)}
                        strokeWidth={props.strokeWidth}
                        strokeAlignment={props.strokeAlignment}
                    >
                        The heading types first, then this line carries on from where it ended.
                    </PaintedText>
                </div>

                {#snippet renderCaret()}
                    <span class={[styles.caret, !isBlinkStopped && !getPrefersReducedMotion() && styles.caretBlinking]} aria-hidden="true"
                    ></span>
                {/snippet}
            </Typewriter>
        </div>
    </PageMeasureBox>

    <div class={styles.buttonRow}>
        <Button
            id={"typeAgain"}
            ariaLabel={"Type it again"}
            onClick={() => {
                controller?.restartAnimation();
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
            {/snippet}
        </Button>

        <Button
            id={"toggleBlink"}
            onClick={() => {
                isBlinkStopped = !isBlinkStopped;
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags}>{isBlinkStopped ? "Start blinking" : "Stop blinking"}</PageControlButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
