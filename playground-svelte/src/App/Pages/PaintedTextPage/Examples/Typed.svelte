<script lang="ts">
    import { Button, MediaQueryMonitorSvelteUtils, PaintedText, Typewriter } from "@thewaver/ss-components-svelte";
    import type { TypewriterController } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextExampleProps } from "../PaintedTextPage.types";

    type Props = PaintedTextExampleProps & {
        computeAnimationName: (character: string, index: number, count: number) => string;
    };

    let props: Props = $props();

    const id = $props.id();

    let controller: TypewriterController | undefined;

    let isBlinkStopped = $state(false);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();
</script>

<div class={styles.stack}>
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

    <div class={styles.buttonRow}>
        <Button
            id={"typeAgain"}
            onClick={() => {
                controller?.restartAnimation();
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>Type it again</PageButtonContent>
            {/snippet}
        </Button>

        <Button
            id={"toggleBlink"}
            onClick={() => {
                isBlinkStopped = !isBlinkStopped;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{isBlinkStopped ? "Start blinking" : "Stop blinking"}</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
