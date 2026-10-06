<script lang="ts">
    import { Button, ScrambleText } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

    const STATUSES = ["CONNECTING", "HANDSHAKE", "AUTHORIZED", "STREAMING", "IDLE"];
    const BOX_WIDTH = 320;
    const FIRST_STATUS = 0;

    type Props = ScrambleTextExampleProps;

    let props: Props = $props();

    let statusIndex = $state(FIRST_STATUS);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <div class={styles.headline}>
            <ScrambleText
                text={STATUSES[statusIndex]}
                computeGlyphs={props.computeGlyphs}
                settleDurationMs={props.settleDurationMs}
                scrambleIntervalMs={props.scrambleIntervalMs}
                computeCharacterWeights={props.computeCharacterWeights}
            />
        </div>
    </PageMeasureBox>

    <Button
        id={"nextStatus"}
        ariaLabel={"Next status"}
        onClick={() => {
            statusIndex = (statusIndex + 1) % STATUSES.length;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.next} />
        {/snippet}
    </Button>
</div>
