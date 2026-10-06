<script lang="ts">
    import { Button, ScrambleText } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/ScrambleTextPage/ScrambleTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { ScrambleTextExampleProps } from "../ScrambleTextPage.types";

    const BUILDS = ["Build 1.4.2 ready", "Build 1.4.3 ready", "Build 1.4.3 RC1 ready", "Build 1.5.0 ready"];
    const BOX_WIDTH = 320;
    const FIRST_BUILD = 0;

    type Props = ScrambleTextExampleProps;

    let props: Props = $props();

    let buildIndex = $state(FIRST_BUILD);
</script>

<div class={styles.stack}>
    <PageMeasureBox width={BOX_WIDTH} padding={MEASURE_BOX_PADDING}>
        <div class={styles.headline}>
            <ScrambleText
                text={BUILDS[buildIndex]}
                changedOnly={true}
                computeGlyphs={props.computeGlyphs}
                settleDurationMs={props.settleDurationMs}
                scrambleIntervalMs={props.scrambleIntervalMs}
                computeCharacterWeights={props.computeCharacterWeights}
            />
        </div>
    </PageMeasureBox>

    <Button
        id={"nextBuild"}
        ariaLabel={"Next build"}
        onClick={() => {
            buildIndex = (buildIndex + 1) % BUILDS.length;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.next} />
        {/snippet}
    </Button>
</div>
