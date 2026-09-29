<script lang="ts">
    import { Button, ScrambleText } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
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
        onClick={() => {
            statusIndex = (statusIndex + 1) % STATUSES.length;
        }}
    >
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>Next status</PageButtonContent>
        {/snippet}
    </Button>
</div>
