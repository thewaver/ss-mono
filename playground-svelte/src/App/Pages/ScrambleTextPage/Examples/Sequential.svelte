<script lang="ts">
    import { Button, ScrambleText } from "@thewaver/ss-components-svelte";
    import type { ScrambleTextController } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

    const LINE = "DECRYPTING PAYLOAD FROM THE ARCHIVE";
    const BOX_WIDTH = 320;
    const SINGLE_CHARACTER = 1;
    const ROLLS_PER_CHARACTER = 6;
    const RUN_MULTIPLIER = 4;
    const MIN_INTERVAL_MS = 12;

    type Props = ScrambleTextExampleProps;

    let props: Props = $props();

    let controller: ScrambleTextController | undefined;

    const runDurationMs = $derived(props.settleDurationMs * RUN_MULTIPLIER);

    const churnDurationMs = $derived(runDurationMs / Math.max(LINE.length - SINGLE_CHARACTER, SINGLE_CHARACTER));

    const scrambleIntervalMs = $derived(Math.max(churnDurationMs / ROLLS_PER_CHARACTER, MIN_INTERVAL_MS));
</script>

<div class={styles.stack}>
    <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <div class={styles.headline}>
            <ScrambleText
                text={LINE}
                computeGlyphs={props.computeGlyphs}
                settleDurationMs={runDurationMs}
                {churnDurationMs}
                {scrambleIntervalMs}
                onMount={(next) => {
                    controller = next;
                }}
            />
        </div>
    </PageMeasureBox>

    <Button
        id={"revealAgain"}
        ariaLabel={"Reveal again"}
        onClick={() => {
            controller?.restartAnimation();
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
        {/snippet}
    </Button>
</div>
