<script lang="ts">
    import { Button, Typewriter } from "@thewaver/ss-components-svelte";
    import type { TypewriterController } from "@thewaver/ss-components-svelte";
    import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
    import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
    import knight from "@thewaver/ss-playground/App/knight.webp";

    import PageMeasureBox from "../../../PageComponents/MeasureBox/MeasureBox.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { TypewriterComplexExampleProps } from "../TypewriterPageSvelte.types";

    type Props = TypewriterComplexExampleProps;

    let props: Props = $props();

    let controller: TypewriterController | undefined;

    let isPlaying = $state(true);
    let isVanishing = $state(false);

    const computeAnimationName = (character: string, index: number, count: number) =>
        isVanishing ? styles.typewriterVanish : props.computeAnimationName(character, index, count);
</script>

<div class={styles.complexStack}>
    <PageMeasureBox width={props.width} padding={MEASURE_BOX_PADDING}>
        <Typewriter
            bind:playback={isPlaying}
            {computeAnimationName}
            computeCharacterWeights={props.computeCharacterWeights}
            onMount={(next) => {
                controller = next;
            }}
            onAnimationEnd={() => {
                if (isVanishing) isPlaying = false;
            }}
        >
            This is a bit of <b
                >text that appears<div class={styles.textHighlight} style:color={"red"} title="ONE MEANS ONE!"><i>one</i></div
                ></b
            ><span>single</span>{" text character\tat a time,"}<br /><br /><div
                style:width={"100%"}
                style:height={"0.5em"}
                style:border-bottom={"2px solid currentColor"}
            ></div>{"and has\nescaped "}<img src={knight} alt="" height={24} style:vertical-align={"middle"} /><a
                href="http://www.google.com">characters.</a
            >
        </Typewriter>
    </PageMeasureBox>

    <div class={styles.complexControls}>
        <Button
            id={"typeItAgain"}
            onClick={() => {
                isVanishing = false;
                controller?.restartAnimation();
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags}>Fade in</PageControlButtonContent>
            {/snippet}
        </Button>

        <Button
            id={"fadeItOut"}
            onClick={() => {
                isVanishing = true;
                controller?.restartAnimation();
            }}
        >
            {#snippet renderContent(flags)}
                <PageControlButtonContent {flags}>Fade out</PageControlButtonContent>
            {/snippet}
        </Button>
    </div>
</div>
