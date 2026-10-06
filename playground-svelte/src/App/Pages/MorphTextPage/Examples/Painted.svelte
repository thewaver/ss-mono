<script lang="ts">
    import { Button, MorphText, PaintedText, SVGDefsSamples } from "@thewaver/ss-components-svelte";
    import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";
    import {
        MORPH_PAINT,
        MORPH_PAINT_TIMING,
        PAINTED_WORDS,
    } from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/MorphTextPage/MorphTextPage.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import { computePaintDefs } from "../../../PageComponents/PaintPicker/PaintPicker.const";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import type { MorphTextExampleProps } from "../MorphTextPage.types";

    const PAINT_SETTINGS = { colors: SVGDefsSamples.SAMPLE_COLORS, ...MORPH_PAINT_TIMING };

    type Props = MorphTextExampleProps;

    let props: Props = $props();

    const id = $props.id();

    let index = $state(0);
    let isPlaying = $state(true);

    $effect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            index = (index + 1) % PAINTED_WORDS.length;
        }, MorphTextKnobs.CYCLE_MS);

        return () => clearInterval(interval);
    });

    $effect(() => {
        props.onWordChange(PAINTED_WORDS[index]);
    });
</script>

<div class={styles.stage}>
    <div class={styles.paintedWord}>
        <MorphText text={PAINTED_WORDS[index]} morphDurationMs={props.morphDurationMs} maxBlurPx={props.maxBlurPx}>
            {#snippet renderText(text)}
                <PaintedText
                    computeFillDefs={(size, element) =>
                        computePaintDefs(MORPH_PAINT, PAINT_SETTINGS, "fill", `fill-${id}-${text}`, size, element)}
                >
                    {text}
                </PaintedText>
            {/snippet}
        </MorphText>
    </div>

    <Button
        id={"morphPaintedPlayback"}
        ariaLabel={isPlaying ? "Pause" : "Play"}
        onClick={() => {
            isPlaying = !isPlaying;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={isPlaying ? CONTROL_GLYPHS.pause : CONTROL_GLYPHS.play} />
        {/snippet}
    </Button>
</div>
