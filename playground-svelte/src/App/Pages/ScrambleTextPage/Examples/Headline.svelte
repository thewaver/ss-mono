<script lang="ts">
    import { Button, ScrambleText } from "@thewaver/ss-components-svelte";
    import type { ScrambleTextController } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

    const HEADLINE = "SYSTEM ONLINE";
    const BOX_WIDTH = 320;

    type Props = ScrambleTextExampleProps;

    let props: Props = $props();

    let controller: ScrambleTextController | undefined;
</script>

<div class={styles.stack}>
    <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <div class={styles.headline}>
            <ScrambleText
                text={HEADLINE}
                computeGlyphs={props.computeGlyphs}
                settleDurationMs={props.settleDurationMs}
                scrambleIntervalMs={props.scrambleIntervalMs}
                computeCharacterWeights={props.computeCharacterWeights}
                onMount={(next) => {
                    controller = next;
                }}
            />
        </div>
    </PageMeasureBox>

    <Button
        id={"runItAgain"}
        ariaLabel={"Run it again"}
        onClick={() => {
            controller?.restartAnimation();
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
        {/snippet}
    </Button>
</div>
