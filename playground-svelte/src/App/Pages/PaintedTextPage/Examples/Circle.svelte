<script lang="ts">
    import { Button, PaintedText, PaintedTextUtils } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import { computeSampleDefs } from "../PaintedTextPage.const";
    import type { PaintedTextCircleExampleProps } from "../PaintedTextPage.types";

    const RING_TEXT = "PAINTED TEXT • ROUND A CIRCLE • ";

    type Props = PaintedTextCircleExampleProps;

    let { progress = $bindable(), playback = $bindable(), ...props }: Props = $props();

    const id = $props.id();

    const path = $derived(PaintedTextUtils.computeCirclePath({ x: props.radius, y: props.radius }, props.radius));
</script>

<div class={styles.stack}>
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

    <div class={styles.buttonRow}>
        <Button
            id={"circlePlayback"}
            onClick={() => {
                playback = !playback;
            }}
        >
            {#snippet renderContent(flags)}
                <PageButtonContent {flags}>{playback ? "Pause" : "Play"}</PageButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
