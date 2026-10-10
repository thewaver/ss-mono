<script lang="ts">
    import { Button, Typewriter } from "@thewaver/ss-components-svelte";
    import type { TypewriterController } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
    import knight from "@thewaver/ss-playground/App/knight.webp";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { TypewriterComplexExampleProps } from "../TypewriterPage.types";

    type Props = TypewriterComplexExampleProps;

    let props: Props = $props();

    let controller: TypewriterController | undefined;
</script>

<div class={styles.complexStack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <Typewriter
            computeAnimationName={props.computeAnimationName}
            computeCharacterWeights={props.computeCharacterWeights}
            onMount={(next) => {
                controller = next;
            }}
        >
            This is a bit of <b
                >text that appears<div class={styles.textHighlight} style:color={"red"} title="ONE MEANS ONE!"><i>one</i></div
                ></b
            ><span>single</span>{" text character\tat a time,"}<br /><br /><div
                style:width={"100%"}
                style:height={"0.5em"}
                style:border-bottom={"2px solid currentColor"}
            ></div>{"and has\nescaped "}<img src={knight} height={24} style:vertical-align={"middle"} /><a
                href="http://www.google.com">characters.</a
            >
        </Typewriter>
    </PageMeasureBox>

    <Button
        id={"typeItAgain"}
        ariaLabel={"Type it again"}
        onClick={() => {
            controller?.restartAnimation();
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
        {/snippet}
    </Button>
</div>
